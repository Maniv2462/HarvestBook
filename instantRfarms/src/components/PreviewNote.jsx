import React, { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';

function PreviewNote({ formData, onEdit, onGenerate }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [sigImageSrc, setSigImageSrc] = useState(null);

  // AUTOMATIC MATH
  const totalCost = (parseFloat(formData.weight) || 0) * (parseFloat(formData.rate) || 0);
  const finalBalance = totalCost - (parseFloat(formData.hire) || 0) - (parseFloat(formData.extra) || 0);

  // SIGNATURE CANVAS EVENT LISTENERS
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    ctx.strokeStyle = '#000000'; 
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const getPos = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    };

    const startDrawing = (e) => {
      if (e.touches) e.preventDefault(); 
      const pos = getPos(e);
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      setIsDrawing(true);
    };

    const draw = (e) => {
      if (!isDrawing) return;
      if (e.touches) e.preventDefault();
      const pos = getPos(e);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    };

    const stopDrawing = () => {
      ctx.closePath();
      setIsDrawing(false);
    };

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);

    canvas.addEventListener('touchstart', startDrawing, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', stopDrawing);

    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mouseleave', stopDrawing);
      canvas.removeEventListener('touchstart', startDrawing);
      canvas.removeEventListener('touchmove', draw);
      canvas.removeEventListener('touchend', stopDrawing);
    };
  }, [isDrawing]);

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSigImageSrc(null);
  };

  const handleGenerateClick = async () => {
    const canvas = canvasRef.current;
    const signatureDataUrl = canvas.toDataURL('image/png');
    
    setSigImageSrc(signatureDataUrl);

    setTimeout(async () => {
      const targetElement = document.getElementById('a4-page');
      
      const canvasSnapshot = await html2canvas(targetElement, {
        scale: 2, 
        useCORS: true,
        logging: false,
        backgroundColor: null
      });

      const finalCompressedUri = canvasSnapshot.toDataURL('image/png');
      onGenerate(finalCompressedUri);
    }, 120);
  };

  const formatDate = (rawDate) => {
    if (!rawDate) return "........";
    const [year, month, day] = rawDate.split("-");
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="screen">
      <h2>👁 Preview / ప్రివ్యూ</h2>

      <div style={{ overflowX: 'auto', paddingBottom: '20px' }}>
        
        {/* A4 MAIN CONTAINER */}
        <div id="a4-page" style={{ backgroundColor: '#FFFFFF', color: '#000000', padding: '50px', fontFamily: '"Segoe UI", sans-serif', width: '794px', height: '1123px', boxSizing: 'border-box', margin: '0 auto', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}>
            
          {/* TOP SECTION: TITLE, DATE, AND MAIN DATA ENTRIES */}
          <div>
            {/* GREEN TITLE BOX CONTAINER */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
              <div style={{ border: '2px solid #2E7D32', padding: '6px 40px', borderRadius: '6px' }}>
                <h2 style={{ margin: 0, fontSize: '26px', fontWeight: 'bold', color: '#2E7D32', letterSpacing: '1px' }}>రైతు డెలివరీ నోటు</h2>
              </div>
            </div>

            {/* RIGHT ALIGNED DATE - CENTERED ON DOTS */}
            <div style={{ textAlign: 'right', marginBottom: '25px', fontSize: '16px', fontWeight: 'bold' }}>
              తేది: <span style={{ borderBottom: '1px dotted #000000', display: 'inline-block', width: '150px', textAlign: 'center' }}>{formatDate(formData.date)}</span>
            </div>

            {/* CORE SPECIFICATIONS SHEET GRID */}
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '16px', lineHeight: '2.8' }}>
              <tbody>
                <tr>
                  <td style={{ width: '35px' }}>1.</td>
                  <td style={{ width: '220px' }}>రైతు పేరు</td>
                  <td style={{ width: '20px' }}>:</td>
                  {/* UPDATED: text-align center on the dotted row */}
                  <td style={{ borderBottom: '1px dotted #000000', textAlign: 'center', fontWeight: '600', paddingRight: '40px' }}>
                    {formData.farmerName || "........"}
                  </td>
                </tr>
                <tr>
                  <td>2.</td><td>అడ్రస్సు</td><td>:</td>
                  <td style={{ borderBottom: '1px dotted #000000', textAlign: 'center', paddingRight: '40px' }}>{formData.address || "........"}</td>
                </tr>
                <tr>
                  <td>3.</td><td>ఎచ్చట నుండి</td><td>:</td>
                  <td style={{ borderBottom: '1px dotted #000000', textAlign: 'center', paddingRight: '40px' }}>{formData.from || "........"}</td>
                </tr>
                <tr>
                  <td>4.</td><td>ఎచ్చటకు</td><td>:</td>
                  <td style={{ borderBottom: '1px dotted #000000', textAlign: 'center', paddingRight: '40px' }}>{formData.to || "........"}</td>
                </tr>
                <tr>
                  <td>5.</td><td>సరుకుల వివరం</td><td>:</td>
                  <td style={{ borderBottom: '1px dotted #000000', textAlign: 'center', paddingRight: '40px' }}>{formData.product || "........"}</td>
                </tr>
                {/* 6. COMBINED WEIGHT AND RATE - BOTH CENTERED ON THEIR SECTIONS */}
                <tr>
                  <td>6.</td><td>మొత్తం తూకం</td><td>:</td>
                  <td style={{ borderBottom: '1px dotted #000000', paddingRight: '40px' }}>
                    <div style={{ display: 'flex', width: '100%' }}>
                      <div style={{ flex: '1', textAlign: 'center' }}>{formData.weight || "........"}</div>
                      <div style={{ width: '150px', textAlign: 'right', paddingRight: '10px' }}>ధర :</div>
                      <div style={{ flex: '1', textAlign: 'center' }}>{formData.rate || "........"}</div>
                    </div>
                  </td>
                </tr>
                {/* 7. TOTAL COST FIELD - CENTERED */}
                <tr>
                  <td>7.</td><td>మొత్తం ఖరీదు</td><td>:</td>
                  <td style={{ borderBottom: '1px dotted #000000', textAlign: 'center', fontWeight: 'bold', paddingRight: '40px' }}>
                    {totalCost > 0 ? totalCost + "/-" : "Kataprakaram"}
                  </td>
                </tr>
                <tr>
                  <td>8.</td><td>వాహనము నెంబరు</td><td>:</td>
                  <td style={{ borderBottom: '1px dotted #000000', textAlign: 'center', paddingRight: '40px' }}>{formData.vehicle || "........"}</td>
                </tr>
                <tr>
                  <td>9.</td><td>ఓనరు పేరు</td><td>:</td>
                  <td style={{ borderBottom: '1px dotted #000000', textAlign: 'center', paddingRight: '40px' }}>{formData.driver || "........"}</td>
                </tr>
                {/* 10. WRAPPED SALE ADDRESS LABELS - CENTERED */}
                <tr>
                  <td style={{ verticalAlign: 'top', paddingTop: '8px' }}>10.</td>
                  <td style={{ verticalAlign: 'top', paddingTop: '8px', lineHeight: '1.4', fontSize: '15px' }}>
                    విక్రయమునకై ఎవరి కొట్టుకు తీసుకొని వెళ్ళుచున్నది వారి అడ్రсу
                  </td>
                  <td style={{ verticalAlign: 'top', paddingTop: '8px' }}>:</td>
                  <td style={{ borderBottom: '1px dotted #000000', textAlign: 'center', paddingRight: '40px', verticalAlign: 'bottom' }}>
                    {formData.saleAddress || "........"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* BOTTOM SECTION: CLAUSES, BALANCES, AND SIGNATURE SYSTEM */}
          <div>
            {/* VERIFICATION DISCLAIMER TEXT */}
            <div style={{ textAlign: 'right', fontSize: '16px', fontWeight: 'bold', marginBottom: '40px', paddingRight: '10px' }}>
              పైన వ్రాసినదంతయు యదార్ధము
            </div>

            {/* DYNAMIC FARMER SIGNATURE OUTPUT BOX */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '30px' }}>
              <div style={{ textAlign: 'center', width: '250px' }}>
                <div style={{ borderBottom: '1px solid #000000', height: '60px', marginBottom: '6px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  {sigImageSrc && <img src={sigImageSrc} alt="Signature" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />}
                </div>
                <span style={{ fontSize: '15px', fontWeight: 'bold' }}>రైతు సంతకం</span>
              </div>
            </div>

            {/* LEGAL AND ACCOUNTING TERMS CONDITIONS WITH CENTERED DOT VALUE PACKETS */}
            <div style={{ fontSize: '16px', lineHeight: '2.2', paddingLeft: '5px' }}>
              <div style={{ marginBottom: '6px' }}>
                1. కిరాయి 
                <span style={{ borderBottom: '1px dotted #000000', display: 'inline-block', width: '120px', textAlign: 'center', fontWeight: '600' }}>
                  {formData.hire ? formData.hire + "/-" : "........"}
                </span> 
                <span style={{ marginLeft: '15px' }}>+ మామూలు, అడ్వాన్సు</span> 
                <span style={{ borderBottom: '1px dotted #000000', display: 'inline-block', width: '120px', textAlign: 'center', fontWeight: '600' }}>
                  {formData.extra ? formData.extra + "/-" : "........"}
                </span>
              </div>
              
              <div style={{ marginBottom: '20px', paddingLeft: '18px' }}>
                పోను వెరశి మొత్తము 
                <span style={{ borderBottom: '1px dotted #000000', display: 'inline-block', width: '160px', textAlign: 'center', fontWeight: 'bold', fontSize: '18px' }}>
                  {finalBalance !== 0 ? finalBalance + "/-" : totalCost > 0 ? totalCost + "/-" : "........"}
                </span> 
                యివ్వగలరు.
              </div>

              <div style={{ marginBottom: '6px', fontSize: '15px', color: '#333' }}>
                2. అగ్రికల్చర్ సెస్సు రసీదు తీసుకొని డబ్బు ఇవ్వగలరు.
              </div>
              
              <div style={{ fontSize: '15px', color: '#333' }}>
                3. అదనముగా చెల్లించిన కమర్షియల్ టాక్స్ రసీదు తీసుకొని డబ్బు ఇవ్వగలరు.
              </div>
            </div>
          </div>

        </div>
        {/* END OF A4 PAGE CONTAINER */}

      </div>

      {/* USER PAD INPUT INTERFACES */}
      <h3 style={{ marginTop: '20px' }}>✍️ సంతకం చేయండి / Sign Here</h3>
      <canvas 
        ref={canvasRef} 
        width="320" 
        height="140" 
        style={{ backgroundColor: 'var(--input-bg)', border: '2px dashed var(--border-color)', borderRadius: '8px', display: 'block', margin: '0 auto 15px auto', cursor: 'crosshair' }}
      />

      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={clearSignature} style={{ width: '100%', backgroundColor: '#6B7280' }}>Clear Signature</button>
        <button onClick={onEdit} style={{ width: '100%', backgroundColor: '#6B7280' }}>✏️ Edit</button>
        <button onClick={handleGenerateClick} style={{ width: '100%' }}>🖼 Generate Note</button>
      </div>
    </div>
  );
}

export default PreviewNote;