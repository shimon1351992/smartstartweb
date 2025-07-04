import React, { useState, useEffect } from 'react';



// טעינה כללית של כל השפות
import MonacoEditor from 'react-monaco-editor';







import BlocklyBuilder from './BlocklyBuilder'; // הנתיב בהתאם למקום שמירת הקובץ

function App() {
  const [page, setPage] = useState(null);
  const [slideIdx, setSlideIdx] = useState(0);
  const [minuts, setMinuts] = useState(0); // דקות
  const [seconds, setSeconds] = useState(0); // שניות
  const [isActive, setIsActive] = useState(false);
  const [timerColor, setTimerColor] = useState('black');
  const [arduinoCode, setArduinoCode] = useState('// Write your Arduino code here\n');
  const [showCode, setShowCode] = useState(false);
  const [fileName, setFileName] = useState('my_arduino_code.ino');
  const [result, setResult] = useState('');



  const backgrounds = {
    picto: 'linear-gradient(135deg,#f0d0e4 0%,#f0a0c0 100%)',
    app: 'linear-gradient(135deg,#baf6b0 0%,#ccd594 100%)',
    build: 'linear-gradient(135deg,#eee5d6 0%,#ddd3b8 100%)'
  };

  useEffect(() => {
  document.body.style.overflow = 'auto'; // או 'scroll' כדי לאפשר גלילה
}, []);
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(prev => prev - 1);
      } else {
        if (minuts > 0) {
          setMinuts(prev => prev - 1);
          setSeconds(59);
        } else {
          // סיימנו
          clearInterval(interval);
          setIsActive(false);
          setSeconds(0);
          setMinuts(0);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, seconds, minuts]);

  useEffect(() => {
    if (minuts === 0) {
      setTimerColor('red'); // הפוך לאדום
    } else {
      setTimerColor('#e67e22'); // חזרה לצבע ברירת מחדל
    }
  }, [minuts]);

  const toggleTimer = () => {
    // אם הטיימר כבר פעיל, נעשה איפוס מיידי ל-9:59
    if (isActive) {
      setIsActive(false);
    }
    // לאחר הלחיצה, להתחיל מ-9:59 אם הוא לא כבר ריק
    if (minuts === pages["build"][slideIdx].time && seconds === 0 && !isActive) {
      setMinuts(prev => (prev > 0 ? prev - 1 : 0));
      setSeconds(59);
      setIsActive(true);
    } else {
      // הפעלה או הפסקה רגילה
      setIsActive(false);
      setMinuts(pages["build"][slideIdx].time);
      setSeconds(0);
    }
  };

  // איפוס גם במצב לחיצה על השעון
  const handleReset = () => {
    if (isActive) {
      setIsActive(false);
      setMinuts(10);
      setSeconds(0);
      // אפשר גם לאתחל את הטיימר כאן אם רוצים
    } else {
      setIsActive(true);
    }


  };



  const pages = {
    picto: [
      {
        // images: [bgImage, bgImage1], // החלף לנתיב התמונות שלך
        editor: true

      },
      {
        title: "איך לעבור בין השקופיות",
        content: "jvjvjvjhvvhvhhkv",
        // image: require('./תמונה1.png') // החלף לנתיב התמונות שלך
      },
      {
        title: "סיום ההסבר",
        content: "זהו חלק זה מסביר את תהליך כתיבת קוד עם בלוקים בפיקטובוקס.",
        // image: require('./תמונה1.png') // החלף לנתיב התמונות שלך
      }
    ],
    app: [
      { images: ['https://i.imgur.com/1rcoq3f.png'], time: 3 },
      { "images": ['https://i.imgur.com/keV3wfH.png'], "time": 3 },
      { "images": ['https://i.imgur.com/ZPahgwS.png'], "time": 3 },
      { "images": ['https://i.imgur.com/Da1NsUU.png'], "time": 3 },
      { "images": ['https://i.imgur.com/TSZY4Mg.png'], "time": 3 },
      { "images": ['https://i.imgur.com/5ZhIKo3.png'], "time": 3 },
      { "images": ['https://i.imgur.com/JSTcqHh.png'], "time": 3 },
      { "images": ['https://i.imgur.com/eTBaHcj.png'], "time": 3 },
      { "images": ['https://i.imgur.com/he5pk9H.png'], "time": 3 },
      { "images": ['https://i.imgur.com/qOliI7h.png'], "time": 3 },
      { "images": ['https://i.imgur.com/jwvBS0C.png'], "time": 3 },
      { "images": ['https://i.imgur.com/5uiETvd.png'], "time": 3 },
    
     
    ],
    build: [
      { images: ['https://i.imgur.com/sMXGAXp.png'], time: 3 },
      { images: ['https://i.imgur.com/aGV5OzV.png'], time: 5 },
      { images: ['https://i.imgur.com/oxDtW5n.png'], time: 7 },
      { images: ['https://i.imgur.com/FCJ0oxR.png'], time: 4 },
      { images: ['https://i.imgur.com/rzc1rNf.png'], time: 6 },
      { images: ['https://i.imgur.com/rtGfSda.png'], time: 8 },
      { images: ['https://i.imgur.com/hhbnFYr.png'], time: 10 },
      { images: ['https://i.imgur.com/iQIFDRc.png'], time: 12 },
      { images: ['https://i.imgur.com/ePQxlfp.png'], time: 14 },
      { images: ['https://i.imgur.com/Ys6ZEfK.png'], time: 16 },
      { images: ['https://i.imgur.com/DxQkfT3.png'], time: 18 },
      { images: ['https://i.imgur.com/DxQkfT3.png'], time: 20 },
      { images: ['https://i.imgur.com/vAkRuk9.png'], time: 9 },
      { images: ['https://i.imgur.com/p5eCWri.png'], time: 8 },
      { images: ['https://i.imgur.com/KKOdks6.png'], time: 7 },
      { images: ['https://i.imgur.com/4zlFxst.png'], time: 6 },
      { images: ['https://i.imgur.com/0FHidvE.png'], time: 5 },
      { images: ['https://i.imgur.com/5qneNKt.png'], time: 4 },
      { images: ['https://i.imgur.com/csko2A5.png'], time: 3 },
      { images: ['https://i.imgur.com/fn1WYZ6.png'], time: 2 },
      { images: ['https://i.imgur.com/xIYDlPp.png'], time: 10 },
      { images: ['https://i.imgur.com/YxEtjV3.png'], time: 9 },
      { images: ['https://i.imgur.com/JBm9xrw.png'], time: 8 },
      { images: ['https://i.imgur.com/vWzY3ow.png'], time: 7 },
      { images: ['https://i.imgur.com/WRLFhaY.png'], time: 6 },
      { images: ['https://i.imgur.com/kNnVyVw.png'], time: 5 },
      { images: ['https://i.imgur.com/Txs8xnK.png'], time: 4 },
      { images: ['https://i.imgur.com/ZmHpbjX.png'], time: 3 },
      { images: ['https://i.imgur.com/HDibzCd.png'], time: 2 },
      { images: ['https://i.imgur.com/pbOsUEn.png'], time: 1 },
      { images: ['https://i.imgur.com/lesX1JG.png'], time: 4 },
      { images: ['https://i.imgur.com/3S5oaOD.png'], time: 6 },
      { images: ['https://i.imgur.com/a3nsOu5.png'], time: 8 },
      { images: ['https://i.imgur.com/FvljNBF.png'], time: 10 },
      { images: ['https://i.imgur.com/gxbOhRO.png'], time: 12 },
      { images: ['https://i.imgur.com/vg34nj6.png'], time: 15 },
      { images: ['https://i.imgur.com/gwZSFgU.png'], time: 15 },
      { images: ['https://i.imgur.com/W2MSzau.png'], time: 20 },
      { images: ['https://i.imgur.com/VVy3z0X.png'], time: 8 },
      { images: ['https://i.imgur.com/FZj6zYC.png'], time: 10 },
      { images: ['https://i.imgur.com/4aqqb61.png'], time: 12 },
      { images: ['https://i.imgur.com/YyQ1P5d.png'], time: 15 },
      { images: ['https://i.imgur.com/JXZ4O0E.png'], time: 15 },
      { images: ['https://i.imgur.com/ZcxigmJ.png'], time: 20 },
      { images: ['https://i.imgur.com/hso7643.png'], time: 8 },
      { images: ['https://i.imgur.com/zDdDxGz.png'], time: 10 },
      { images: ['https://i.imgur.com/SD5VFLj.png'], time: 10 },
      { images: ['https://i.imgur.com/aHtbRHM.png'], time: 10 },
      { images: ['https://i.imgur.com/DfTzw2K.png'], time: 10 },
      { images: ['https://i.imgur.com/3ROiVjP.png'], time: 10 },
      { images: ['https://i.imgur.com/bCigtHx.png'], time: 10 },
      { images: ['https://i.imgur.com/dnVE9OW.png'], time: 10 },
      { images: ['https://i.imgur.com/j6Y6FPt.png'], time: 10 },
      { images: ['https://i.imgur.com/sZcdPqC.png'], time: 10 },
      { images: ['https://i.imgur.com/6MckZmS.png'], time: 10 },
      { images: ['https://i.imgur.com/3m68PkZ.png'], time: 10 },
      { images: ['https://i.imgur.com/RukoQCs.png'], time: 10 },
      { images: ['https://i.imgur.com/GjfaNLF.png'], time: 10 },
      { images: ['https://i.imgur.com/BoAum4x.png'], time: 10 },
      { images: ['https://i.imgur.com/tpOK7fL.png'], time: 10 },
      { images: ['https://i.imgur.com/fUdbV6U.png'], time: 10 },

    
    ]
  };

  const handlePageChange = (pageName) => {
    setPage(pageName);
    setSlideIdx(0);
  };

  const handleNext = () => {
    if (page && slideIdx < pages[page].length - 1) {
      setSlideIdx(slideIdx + 1);
      setMinuts(pages[page][slideIdx + 1].time);
      setSeconds(0);
      setIsActive(false);
    }
  };

  const handlePrev = () => {
    if (page && slideIdx > 0) {
      setSlideIdx(slideIdx - 1);
      setMinuts(pages[page][slideIdx - 1].time);
      setSeconds(0);
      setIsActive(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([arduinoCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    // כאן משתמש בשם שהמשתמש הכניס, עם סיומת `.ino`
    link.download = fileName.endsWith('.ino') ? fileName : fileName + '.ino';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };


  const compileCode = async () => {
    try {
      setResult('try to conect...');
      const response = await fetch('http://localhost:3001/compile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: arduinoCode }),
      });
      const data = await response.json();
      setResult(data.output); // שומר את התוצאות
    } catch (err) {
      setResult('שגיאה בהתקשרות לשרת');
    }
  };

  return (

    <div style={{
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
      background: backgrounds[page] || 'linear-gradient(135deg,#eee5d6 0%,#eee5d6 100%)', // ברירת מחדל
      overflowY: 'auto', // קריטי לגלילה
      maxHeight: '100vh', // חשוב כדי שה־div לא יחרוג מגובה המסך ויאפשר גלילה
      minHeight: '100vh',
      textAlign: 'center'
    }}>
      <div
        style={{
          position: 'fixed',
          top: '10px',
          right: '20px',
          zIndex: 999,
          borderRadius: '50%',
          backgroundColor: '#2980b9',
          width: '50px',
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          cursor: 'pointer',
          border: '2px solid #fff',
          fontSize: '1.5em',
          color: '#fff'
        }}
        onClick={() => setShowCode(true)}
        title="פתח עורך קוד"
      >
        🚀
      </div>

      {showCode && (
        <>
          <div style={{
            position: 'fixed',
            top: '50px',
            right: '10px',
            width: '50%',
            height: '80%',
            backgroundColor: 'white',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            zIndex: 998,
            display: 'flex',
            flexDirection: 'column',
            border: '2px solid #555',
            borderRadius: '8px',
            padding: '10px'
          }}>

            {/* החלק העליון עם כותרת וכפתור שמירה/סגירה */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <button
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#2980b9',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
                onClick={() => {
                  alert('הקוד נשמר!');
                  setShowCode(false); // סוגר את העורך
                }}
              >
                שמור וצא
              </button>
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                style={{ padding: '8px', width: '300px', marginBottom: '10px' }}
                placeholder="הזן שם לקובץ..."
              />
              <button onClick={compileCode} style={{
                padding: '8px 16px',
                backgroundColor: '#16a085',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginTop: '10px'
              }}>
                קמפל את הקוד
              </button>

              {result && (
                <div style={{ marginTop: '20px', whiteSpace: 'pre-wrap', background: '#eee', padding: '10px', borderRadius: '4px' }}>
                  <h4>תוצאות ההרצה:</h4>
                  {result}
                </div>
              )}
              <button
                style={{
                  marginLeft: '10px',
                  padding: '8px 16px',
                  backgroundColor: '#27ae60',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
                onClick={handleDownload}
              >
                הורד קוד ל-Arduino
              </button>
            </div>

            {/* עורך ה־Monaco */}
            <MonacoEditor
              height="calc(100% - 50px)"
              width="100%"
              language="cpp"
              theme="vs-light"
              value={arduinoCode}
              onChange={(val) => setArduinoCode(val)}
              options={{
                automaticLayout: true,
                lineNumbers: 'on',
                readOnly: false,
                cursorStyle: 'line',
                wordWrap: 'on',
                wrappingIndent: 'indent'
              }}
            />
          </div>
        </>
      )}
      {/* כותרת עליונה מעוצבת */}
      <h1 style={{
        fontSize: '36px',
        marginBottom: '40px',
        color: '#2c3e50',
        textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
        fontWeight: 'bold'
      }}>ברוכים הבאים לפרויקט בית חכם</h1>

      {/* כפתורי ניווט לעמודים */}
      <div style={{ marginBottom: '50px' }}>
        <button onClick={() => handlePageChange('picto')} style={{
          margin: '10px',
          padding: '15px 20px',
          fontSize: '16px',
          backgroundColor: '#2980b9',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          transition: 'background-color 0.3s'
        }} onMouseOver={(e) => e.target.style.backgroundColor = '#3498db'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#2980b9'}>
          PictoBlocks
        </button>
        <button onClick={() => handlePageChange('app')} style={{
          margin: '10px',
          padding: '15px 20px',
          fontSize: '16px',
          backgroundColor: '#27ae60',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          transition: ''
        }} onMouseOver={(e) => e.target.style.backgroundColor = '#2ecc71'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#27ae60'}>
          AppInventor
        </button>
        <button onClick={() => handlePageChange('build')} style={{
          margin: '10px',
          padding: '15px 20px',
          fontSize: '16px',
          backgroundColor: '#e67e22',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          transition: 'background-color 0.3s'
        }} onMouseOver={(e) => e.target.style.backgroundColor = '#d35400'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#e67e22'}>
          בנייה של ערכה
        </button>
      </div>


{/* תצוגת השקופיות – מתקראת רק אם נבחר עמוד */}
{page && (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
    width: '90%',
    margin: '0 auto',
    background: backgrounds[page] || 'linear-gradient(135deg,#eee5d6 0%,#eee5d6 100%)',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    height: "900px"
  }}>

    {/* Timer component */}
    <div
      onClick={toggleTimer}
      style={{
        cursor: 'pointer',
        backgroundColor: timerColor,
        boxShadow: '0 0 15px rgba(0, 0, 0, 0.3)',
        borderRadius: '10%',
        width: '200px',
        height: '100px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '3em',
        userSelect: 'none',
        marginLeft: '20px'
      }}
    >
      {`${minuts.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}
    </div>

    {/* תצוגת שקופית (תמונה/וידאו) */}
    <div style={{ width: '100%', height: '700px', margin: '10px auto', position: 'relative', overflow: 'hidden' }}>
      
      {/* הצגת תמונה אם סוג השקופית הוא לא וידאו */}
      {pages[page][slideIdx].images && pages[page][slideIdx].images.length > 0 && (
        <img
          src={pages[page][slideIdx].images[0]}
          alt={pages[page][slideIdx].title}
          style={{ width: '100%', height: '700px', objectFit: 'contain' ,   left: 0,  top: 0, position: 'absolute', }}
        />
      )}

      {/* אם זו שקופית וידאו, הצג את הוידאו בלבד */}
      {pages[page][slideIdx].type === 'video' && (
        <video
          controls
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '700px',
            objectFit: 'contain'
          }}
        >
          <source src={pages[page][slideIdx].videoSrc} type="video/mp4" />
        </video>
      )}

    </div>

   {page === 'picto' && (
        <div>
          <h2>גרור בלוקים כאן</h2>
          <BlocklyBuilder /> {/* תוסיף אותו כאן */}
        </div>
      )}

  
   

          {/* כפתורי ניווט */}
          <div style={{ marginTop: '30px' }}>
            <button
              onClick={handlePrev}
              disabled={slideIdx === 0}
              style={{
                padding: '10px 20px',
                fontSize: '16px',
                margin: '0 10px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: '#bdc3c7',
                cursor: slideIdx === 0 ? 'not-allowed' : 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                transition: 'background-color 0.3s'
              }}
            >
              חזרה
            </button>
            <button
              onClick={handleNext}
              disabled={slideIdx === pages[page].length - 1}
              style={{
                padding: '10px 20px',
                fontSize: '16px',
                margin: '0 10px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: '#27ae60',
                color: 'white',
                cursor: slideIdx === pages[page].length - 1 ? 'not-allowed' : 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                transition: 'background-color 0.3s'
              }}
            >
              המשך
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;