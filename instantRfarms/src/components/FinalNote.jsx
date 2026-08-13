import React from 'react';

function FinalNote({ generatedImage, onReset, onEdit }) {
  
  // DOWNLOAD ADAPTER
  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = `InstantFarms-Note-${Date.now()}.png`;
    link.href = generatedImage;
    link.click();
  };

  // NATIVE APP WEB SHARE DRAWER (WhatsApp, etc.)
  const handleShare = async () => {
    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const file = new File([blob], 'DeliveryNote.png', { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'రైతు డెలివరీ నోటు / Farmer Delivery Note',
          text: 'InstantFarms ద్వారా జనరేట్ చేయబడిన డెలివరీ నోటు.'
        });
      } else {
        alert("Your browser doesn't support direct file sharing. Please download it first!");
      }
    } catch (error) {
      console.error("Error sharing image:", error);
    }
  };

  return (
    <div className="screen">
      <h2>🎉 మీ నోట్ సిద్ధంగా ఉంది! / Note Generated Successfully</h2>
      
      {/* Displaying the compiled image file natively */}
      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        <img 
          src={generatedImage} 
          alt="Compiled Delivery Note" 
          style={{ width: '100%', maxWidth: '500px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.15)', border: '1px solid var(--border-color)' }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '20px' }}>
        <button onClick={onEdit} style={{ backgroundColor: '#6B7280' }}>✏️ Edit Form</button>
        <button onClick={onReset} style={{ backgroundColor: '#4B5563' }}>🔄 New Note</button>
        <button onClick={handleDownload} style={{ gridColumn: 'span 2' }}>⬇ Download Image</button>
        <button onClick={handleShare} style={{ gridColumn: 'span 2', backgroundColor: '#25D366' }}>📲 Share via WhatsApp</button>
      </div>
    </div>
  );
}

export default FinalNote;