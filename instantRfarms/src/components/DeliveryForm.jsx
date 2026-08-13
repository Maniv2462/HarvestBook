import React from 'react';

// We accept the lifted state data and trigger functions as props from App.jsx
function DeliveryForm({ formData, handleChange, onPreview, onToggleHistory, isHistoryOpen }) {
  
  // AUTOMATIC MATH: Recalculates instantly whenever the props update
  const totalCost = (parseFloat(formData.weight) || 0) * (parseFloat(formData.rate) || 0);
  const finalBalance = totalCost - (parseFloat(formData.hire) || 0) - (parseFloat(formData.extra) || 0);

  return (
    <div className="screen">
      <h1><center>📋<i><u>రైతు డెలివరీ నోట్</u></i></center></h1>

      <div className="row">
        <div className="col">
          <label>రైతు పేరు / Farmer Name *</label>
          <input type="text" name="farmerName" value={formData.farmerName} onChange={handleChange} placeholder="రైతు పేరు" required />
        </div>
        <div className="col">
          <label>తేదీ / Date</label>
          <input type="date" name="date" value={formData.date} onChange={handleChange} />
        </div>
      </div>

      <div className="row">
        <div className="col">
          <label>అడ్రస్సు / Address</label>
          <input name="address" value={formData.address} onChange={handleChange} placeholder="అడ్రస్సు" />
        </div>
        <div className="col">
          <label>ఎచ్చట నుండి / From</label>
          <input name="from" value={formData.from} onChange={handleChange} placeholder="ఎచ్చట నుండి" />
        </div>
        <div className="col">
          <label>ఎచ్చటకు / To</label>
          <input name="to" value={formData.to} onChange={handleChange} placeholder="ఎచ్చటకు" />
        </div>
      </div>

      <h2>🌾 పంట వివరాలు / Crop Details</h2>
      <div className="row">
        <div className="col">
          <label>సరుకుల వివరం / Product</label>
          <input name="product" value={formData.product} onChange={handleChange} placeholder="సరుకుల వివరం" />
        </div>
        <div className="col">
          <label>మొత్తం తూకం / Weight</label>
          <input type="number" name="weight" value={formData.weight} onChange={handleChange} placeholder="మొత్తం తూకం" />
        </div>
        <div className="col">
          <label>ధర / Rate</label>
          <input type="number" name="rate" value={formData.rate} onChange={handleChange} placeholder="ధర" />
        </div>
        <div className="col">
          <label>మొత్తం ఖరీదు / Total</label>
          <input value={totalCost > 0 ? totalCost : ""} placeholder="మొత్తం ఖరీదు" readOnly />
        </div>
      </div>

      <h2>🚛 వాహన వివరాలు / Vehicle Details</h2>
      <div className="row">
        <div className="col">
          <label>వాహనం నెంబర్ / Vehicle Number</label>
          <input name="vehicle" value={formData.vehicle} onChange={handleChange} placeholder="వాహనం నెంబర్" />
        </div>
        <div className="col">
          <label>ఓనర్ పేరు / Driver Name</label>
          <input name="driver" value={formData.driver} onChange={handleChange} placeholder="ఓనర్ పేరు" />
        </div>
      </div>

      <h2>🏪 అమ్మకం స్థలం / Sale Destination</h2>
      <div className="row">
        <div className="col">
          <label>విక్రమునుకై ఎవరి కొట్టుకు తీసుకొని వెళ్ళుచున్నది వారి అడ్రస్సు</label>
          <input name="saleAddress" value={formData.saleAddress} onChange={handleChange} placeholder="Manual Address" />
        </div>
      </div>

      <h2>📝 గమనిక / Special Note</h2>
      <div className="row">
        <div className="col">
          <label>ఏదైనా అదనపు సమాచారం (Optional)</label>
          <textarea 
            name="specialNote" 
            value={formData.specialNote} 
            onChange={handleChange} 
            rows="3" 
            placeholder="ఇక్కడ వ్రాయండి / Write any extra details here..." 
            style={{ width: '100%', padding: '12px', marginTop: '5px', marginBottom: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', boxSizing: 'border-box', fontSize: '16px', fontFamily: 'inherit', resize: 'vertical', backgroundColor: 'var(--input-bg)', color: 'var(--text-main)' }}
          ></textarea>
        </div>
      </div>

      <h2>💰 ఖాతా వివరాలు / Account Details</h2>
      <div className="row">
        <div className="col">
          <label>కిరాయి / Hire</label>
          <input type="number" name="hire" value={formData.hire} onChange={handleChange} />
        </div>
        <div className="col">
          <label>అడ్వాన్స్ / Extra</label>
          <input type="number" name="extra" value={formData.extra} onChange={handleChange} />
        </div>
        <div className="col">
          <label>బ్యాలెన్స్ / Final Amount</label>
          <input value={finalBalance !== 0 ? finalBalance : ""} readOnly />
        </div>
      </div>

      {/* UPDATED BUTTONS WITH PROPS FOR PREVIEW AND TOGGLE HISTORY */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <button onClick={onPreview} style={{ width: '100%' }}>👁 Preview</button>
        <button 
          onClick={onToggleHistory} 
          style={{ width: '100%', backgroundColor: isHistoryOpen ? '#EF4444' : '#6B7280' }}
        >
          {isHistoryOpen ? "❌ Close History" : "📜 History"}
        </button>
      </div>
    </div>
  );
}

export default DeliveryForm;