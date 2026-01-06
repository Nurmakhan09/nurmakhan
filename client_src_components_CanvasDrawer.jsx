import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

/**
 * Simple free drawing canvas with save/load per-user.
 */
export default function CanvasDrawer() {
  const canvasRef = useRef();
  const ctxRef = useRef();
  const drawing = useRef(false);
  const [color, setColor] = useState('#4be0c1');
  const [thickness, setThickness] = useState(2);

  useEffect(()=> {
    const canvas = canvasRef.current;
    canvas.width = canvas.clientWidth * window.devicePixelRatio;
    canvas.height = canvas.clientHeight * window.devicePixelRatio;
    const ctx = canvas.getContext('2d');
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    ctx.lineCap = 'round';
    ctx.strokeStyle = color;
    ctx.lineWidth = thickness;
    ctxRef.current = ctx;
  }, []);

  useEffect(()=> { if(ctxRef.current){ ctxRef.current.strokeStyle = color; } }, [color]);
  useEffect(()=> { if(ctxRef.current){ ctxRef.current.lineWidth = thickness; } }, [thickness]);

  function start(e) {
    drawing.current = true;
    const rect = canvasRef.current.getBoundingClientRect();
    ctxRef.current.beginPath();
    ctxRef.current.moveTo((e.clientX - rect.left), (e.clientY - rect.top));
  }
  function move(e) {
    if(!drawing.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    ctxRef.current.lineTo((e.clientX - rect.left), (e.clientY - rect.top));
    ctxRef.current.stroke();
  }
  function end() {
    drawing.current = false;
  }

  async function save() {
    const dataUrl = canvasRef.current.toDataURL('image/png');
    await axios.post('/drawings', { dataUrl });
    alert('Saved');
  }

  function clearCanvas() {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    ctx.clearRect(0,0,canvas.width,canvas.height);
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
      <div style={{ display:'flex', gap:8 }}>
        <input type="color" value={color} onChange={e=>setColor(e.target.value)} />
        <input type="range" min="1" max="20" value={thickness} onChange={e=>setThickness(e.target.value)} />
        <button className="button" onClick={save}>Save</button>
        <button className="button" onClick={clearCanvas}>Clear</button>
      </div>
      <div className="canvas" style={{ touchAction:'none' }}>
        <canvas ref={canvasRef}
          style={{ width:'100%', height:'100%', display:'block', borderRadius:10 }}
          onMouseDown={start}
          onMouseMove={move}
          onMouseUp={end}
          onMouseLeave={end}
        ></canvas>
      </div>
    </div>
  );
}