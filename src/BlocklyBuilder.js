
import React, { useState, useCallback } from 'react';
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
} from 'react-flow-renderer';

import './BlocklyBuilder.css'; // קובץ CSS ייעודי

// --- קונסטנטות כלליות למידות הבלוקים ---
const NOTCH_SIZE = 10; // גודל הבליטה/שקע
const BLOCK_WIDTH = 150; // רוחב בלוק סטנדרטי
const COMMAND_BLOCK_HEIGHT = 50; // גובה בלוק פקודה רגיל
const START_BLOCK_HEIGHT = 50; // גובה בלוק התחלה
const LOOP_BLOCK_HEIGHT = 150; // גובה בלוק לולאה (כדי שיהיה מקום בפנים)
const SNAP_THRESHOLD = 20; // מרחק בפיקסלים לזיהוי הצמדה

// --- פונקציות עזר ליצירת נתיבי SVG עבור צורות בלוקים ---

// פונקציה ליצירת בלוק "התחל" (עגול למעלה, שקע למטה)
const getStartBlockPath = (width, height) => `
  M ${NOTCH_SIZE} 0
  H ${width - NOTCH_SIZE}
  Q ${width} 0 ${width} ${NOTCH_SIZE} // פינה עגולה למעלה-ימין
  V ${height - NOTCH_SIZE}
  H ${width - NOTCH_SIZE - NOTCH_SIZE} // ימינה אל תחילת השקע
  V ${height} // ירידה לתוך השקע
  H ${NOTCH_SIZE * 2} // נתיב אופקי בתוך השקע
  V ${height - NOTCH_SIZE} // עלייה מסוף השקע
  H 0
  Q 0 0 ${NOTCH_SIZE} 0 // פינה עגולה למעלה-שמאל (תיקון קל)
  Z
`;

// פונקציה ליצירת בלוק "פקודה רגילה" (שקע למעלה, שקע למטה)
const getCommandBlockPath = (width, height) => `
  M 0 ${NOTCH_SIZE}
  H ${NOTCH_SIZE * 2} // ימינה אל תחילת הבליטה
  V 0 // עלייה לתוך הבליטה
  H ${width - NOTCH_SIZE * 2} // נתיב אופקי בתוך הבליטה
  V ${NOTCH_SIZE} // ירידה מסוף הבליטה
  H ${width}
  V ${height - NOTCH_SIZE}
  H ${width - NOTCH_SIZE * 2} // ימינה אל תחילת השקע
  V ${height} // ירידה לתוך השקע
  H ${NOTCH_SIZE * 2} // נתיב אופקי בתוך השקע
  V ${height - NOTCH_SIZE} // עלייה מסוף השקע
  H 0
  Z
`;

// פונקציה ליצירת בלוק "לולאה/תנאי" (שקע למעלה, שקע למטה, חלל פנימי)
const getLoopBlockPath = (width, height) => {
  const indent = 20; // כניסה פנימה מצד שמאל לחלל הפנימי
  const innerHeight = height - NOTCH_SIZE * 2; // גובה פנימי ללא החיבורים למעלה ולמטה

  return `
    M 0 ${NOTCH_SIZE}
    H ${NOTCH_SIZE * 2} V 0 H ${width - NOTCH_SIZE * 2} V ${NOTCH_SIZE} H ${width} // חלק עליון (בליטה)
    V ${height - NOTCH_SIZE} // צד ימין יורד עד החיבור התחתון
    H ${width - NOTCH_SIZE * 2} V ${height} H ${NOTCH_SIZE * 2} V ${height - NOTCH_SIZE} // חלק תחתון (שקע)
    H 0
    Z

    M ${indent} ${NOTCH_SIZE * 2} // התחלת החלק הפנימי (כניסה)
    V ${innerHeight + NOTCH_SIZE} // יורד עד החלק התחתון של הכניסה הפנימית
    H ${indent + NOTCH_SIZE * 2} V ${innerHeight + NOTCH_SIZE * 2} H ${indent + NOTCH_SIZE * 3} V ${innerHeight + NOTCH_SIZE} // בליטה תחתונה פנימית
    H ${width - indent}
    V ${NOTCH_SIZE * 2} // עולה חזרה למעלה
    H ${indent + NOTCH_SIZE * 3} V ${NOTCH_SIZE * 2 + NOTCH_SIZE} H ${indent + NOTCH_SIZE * 2} V ${NOTCH_SIZE * 2} // שקע עליון פנימי
    Z
  `;
};

// --- רכיב בלוק מותאם אישית (Node) ---
const CustomBlock = ({ id, data, type }) => {
  let pathData;
  let blockHeight; // גובה הבלוק בפועל, ישמש גם למיקום handles
  let currentWidth = BLOCK_WIDTH;

  switch (type) {
    case 'startBlock':
      pathData = getStartBlockPath(BLOCK_WIDTH, START_BLOCK_HEIGHT);
      blockHeight = START_BLOCK_HEIGHT;
      break;
    case 'commandBlock':
      pathData = getCommandBlockPath(BLOCK_WIDTH, COMMAND_BLOCK_HEIGHT);
      blockHeight = COMMAND_BLOCK_HEIGHT;
      break;
    case 'loopBlock':
      currentWidth = BLOCK_WIDTH + 20; // קצת רחב יותר ללולאות
      pathData = getLoopBlockPath(currentWidth, LOOP_BLOCK_HEIGHT);
      blockHeight = LOOP_BLOCK_HEIGHT;
      break;
    default:
      pathData = getCommandBlockPath(BLOCK_WIDTH, COMMAND_BLOCK_HEIGHT);
      blockHeight = COMMAND_BLOCK_HEIGHT;
  }

  const textX = currentWidth / 2;
  const textY = blockHeight / 2;

  return (
    <div
      // ה-div החיצוני קובע את השטח ש-react-flow רואה כבלוק
      // חשוב לתת לו את המידות האמיתיות של התוכן
      style={{
        width: currentWidth,
        height: blockHeight,
        position: 'relative',
        overflow: 'visible', // וודא שה-SVG לא נחתך
        pointerEvents: 'none', // מאפשר לחיצות דרך ה-div אל ה-SVG וה-Handles
      }}
    >
      <svg
        width={currentWidth}
        height={blockHeight}
        viewBox={`0 0 ${currentWidth} ${blockHeight}`}
        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'all' }} // SVG יטפל באירועי עכבר
      >
        <path
          d={pathData}
          fill={data.color || '#8BC34A'}
          stroke="#333"
          strokeWidth="1.5"
          filter="url(#shadow)" // הוספת צל
        />
        {/* הגדרת פילטר צללים */}
        <defs>
          <filter id="shadow">
            <feDropShadow dx="1" dy="1" stdDeviation="1.5" floodColor="rgba(0,0,0,0.3)"/>
          </filter>
        </defs>
        <text
          x={textX}
          y={textY}
          fill="white"
          fontSize="16"
          textAnchor="middle"
          alignmentBaseline="middle"
          style={{ userSelect: 'none', pointerEvents: 'none' }} // טקסט לא יתפוס אירועים
        >
          {data.label}
        </text>
      </svg>

      {/* Handles for connection */}
      {/* Target Handle (שקע עליון) - לבלוקים שאינם "התחל" */}
      {type !== 'startBlock' && (
        <Handle
          type="target"
          position={Position.Top}
          id="top-target"
          // המיקום הפיזי של ה-Handle ביחס ל-div החיצוני.
          // הוא צריך להיות במיקום הבליטה/שקע ב-SVG
          style={{
            top: 0, // בקו העליון של ה-div
            left: NOTCH_SIZE * 2, // במיקום תחילת הבליטה
            width: BLOCK_WIDTH - (NOTCH_SIZE * 4), // רוחב הבליטה/שקע
            height: NOTCH_SIZE, // גובה הבליטה/שקע
            background: 'transparent', // שקוף
            border: 'none',
            borderRadius: 0,
          }}
        />
      )}

      {/* Source Handle (בליטה תחתונה) */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom-source"
        style={{
          bottom: 0, // בקו התחתון של ה-div
          left: NOTCH_SIZE * 2, // במיקום תחילת הבליטה
          width: BLOCK_WIDTH - (NOTCH_SIZE * 4),
          height: NOTCH_SIZE,
          background: 'transparent',
          border: 'none',
          borderRadius: 0,
        }}
      />
    </div>
  );
};

// מיפוי סוגי הבלוקים שלנו לרכיבי ה-React המתאימים
const nodeTypes = {
  startBlock: CustomBlock,
  commandBlock: CustomBlock,
  loopBlock: CustomBlock,
};

// --- הגדרת בלוקים (Nodes) וחיבורים (Edges) ראשוניים ---
// כאן נגדיר בלוק התחלה וכמה בלוקי פקודה
const initialNodes = [
  {
    id: 'start-1',
    type: 'startBlock',
    data: { label: 'התחל', color: '#FFC107' },
    position: { x: 250, y: 50 },
  },
  {
    id: 'move-1',
    type: 'commandBlock',
    data: { label: 'לך 10 צעדים', color: '#4CAF50' },
    position: { x: 250, y: 120 }, // מיקום ידני לצורך התחלה, ישתנה עם הצמדה
  },
  {
    id: 'wait-1',
    type: 'commandBlock',
    data: { label: 'המתן 1 שניה', color: '#2196F3' },
    position: { x: 250, y: 190 },
  },
  {
    id: 'turn-1',
    type: 'commandBlock',
    data: { label: 'סובב 90 מעלות', color: '#FF5722' },
    position: { x: 250, y: 260 },
  },
  {
    id: 'loop-1',
    type: 'loopBlock',
    data: { label: 'חזור 3 פעמים', color: '#9C27B0' },
    position: { x: 50, y: 50 }, // בלוק לולאה נפרד
  },
];

const initialEdges = []; // נתחיל בלי חיבורים, הם ייווצרו אוטומטית עם הצמדה

// --- רכיב האפליקציה הראשית ---
function BlocklyBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // פונקציה שמטפלת ביצירת חיבור חדש בין בלוקים
  const onConnect = useCallback((params) => {
    // אנחנו נסתמך בעיקר על הצמדה ולא על גרירת קוים ידנית.
    // אבל אם מישהו יגרור קו, נאפשר זאת.
    setEdges((eds) => addEdge({ ...params, type: 'step', animated: false, selectable: false }, eds));
  }, [setEdges]);

  // פונקציה לטיפול בסיום גרירת בלוק - כאן מתרחשת לוגיקת ההצמדה!
  const onNodeDragStop = useCallback((event, draggedNode) => {
    let snapped = false; // דגל כדי לדעת אם הבלוק הוצמד

    // עבור על כל הבלוקים האחרים (שאינם הבלוק שנגרר)
    nodes.forEach((targetNode) => {
      if (draggedNode.id === targetNode.id) return; // אל תבדוק מול עצמך

      // כרגע נתמקד בהצמדה של בלוק source (תחתון) ל-target (עליון)
      // של בלוקים מסוג 'commandBlock' או 'startBlock'
      if ((draggedNode.type === 'startBlock' || draggedNode.type === 'commandBlock' || draggedNode.type === 'loopBlock') &&
          (targetNode.type === 'commandBlock' || targetNode.type === 'loopBlock')) {

        // חשב את נקודת החיבור התחתונה של הבלוק הנגרר
        const draggedNodeBottomConnectX = draggedNode.position.x + BLOCK_WIDTH / 2;
        const draggedNodeBottomConnectY = draggedNode.position.y + draggedNode.height; // גובה הבלוק הנגרר

        // חשב את נקודת החיבור העליונה של בלוק היעד
        const targetNodeTopConnectX = targetNode.position.x + BLOCK_WIDTH / 2;
        const targetNodeTopConnectY = targetNode.position.y; // קו עליון של בלוק היעד

        // חשב מרחק בין נקודות החיבור (בליטות/שקעים)
        const distanceX = Math.abs(draggedNodeBottomConnectX - targetNodeTopConnectX);
        const distanceY = Math.abs(draggedNodeBottomConnectY - targetNodeTopConnectY);

        // אם הבלוקים קרובים מספיק כדי להיצמד
        if (distanceX < SNAP_THRESHOLD && distanceY < SNAP_THRESHOLD) {
          // חשב את המיקום החדש עבור הבלוק הנגרר
          const newX = targetNode.position.x;
          const newY = targetNode.position.y - draggedNode.height; // הצמד אותו מעל בלוק היעד

          // עדכן את מיקום הבלוק הנגרר ב-state
          setNodes((nds) =>
            nds.map((node) => {
              if (node.id === draggedNode.id) {
                return {
                  ...node,
                  position: { x: newX, y: newY },
                };
              }
              return node;
            })
          );

          // יצירת חיבור (Edge) חדש
          setEdges((eds) => addEdge({
            id: `e-${draggedNode.id}-${targetNode.id}`,
            source: draggedNode.id,
            target: targetNode.id,
            type: 'step', // סוג קו ישר
            animated: false,
            selectable: false, // לא ניתן לבחור את הקו ידנית
          }, eds));

          snapped = true;
          return; // יצא מהלולאה ברגע שנמצאה הצמדה
        }
      }
    });

    // אם הבלוק לא הוצמד לאף אחד, נקה את כל החיבורים היוצאים ממנו
    // כדי למנוע קווים "תלויים" אם הוא לא הוצמד
    if (!snapped) {
      setEdges((eds) => eds.filter(edge => edge.source !== draggedNode.id && edge.target !== draggedNode.id));
    }

  }, [nodes, setNodes, setEdges]);


  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop} // מטפל בהצמדה כשמפסיקים לגרור
        nodeTypes={nodeTypes}
        fitView // מתאים את התצוגה כך שכל הבלוקים ייראו
        attributionPosition="top-right"
        proOptions={{ hideAttribution: true }}
      >
        <MiniMap />
        <Controls />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}

export default BlocklyBuilder;