import { useEffect, useState } from "react";

const LS_KEY = "wasteland_last_visit";

export function OfflineRewardPopup() {
  const [show, setShow] = useState(false);
  const [timeAway, setTimeAway] = useState("");

  useEffect(() => {
    const now = Date.now();
    const lastStr = localStorage.getItem(LS_KEY);
    const last = lastStr ? parseInt(lastStr) : now;
    const diff = now - last;
    
    // Update last visit
    localStorage.setItem(LS_KEY, String(now));
    
    // Show popup if away > 60 seconds
    if (diff > 60000) {
      const mins = Math.floor(diff / 60000);
      const hrs = Math.floor(mins / 60);
      if (hrs > 0) {
        setTimeAway(`${hrs}小时${mins % 60}分`);
      } else {
        setTimeAway(`${mins}分钟`);
      }
      setShow(true);
    }
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#0D0D0A]/80" onClick={() => setShow(false)}>
      <div className="bg-[#0A0A08] border border-[hsl(var(--crt-green))/0.4] rounded-lg p-6 max-w-sm w-full mx-4 font-mono text-sm"
        style={{ boxShadow: '0 0 40px rgba(77,255,77,0.08), inset 0 0 30px rgba(77,255,77,0.02)' }}
        onClick={e => e.stopPropagation()}>
        <p className="text-[hsl(var(--crt-green))/0.6] text-[10px] uppercase tracking-widest mb-3">{'>'} 系统恢复供电 _</p>
        <p className="text-[hsl(var(--crt-green))] mb-2">{'>'} 离线时间：{timeAway}</p>
        <p className="text-[hsl(var(--crt-green))/0.7] mb-1">{'>'} 避难所自动运行中...</p>
        <p className="text-[hsl(var(--crt-green))/0.5] mb-1">{'>'} 采集 & 生产持续进行</p>
        <p className="text-[hsl(var(--crt-green))/0.5] mb-4">{'>'} 战利品已自动筛选</p>
        <p className="text-[hsl(var(--crt-green))/0.3] text-[10px] mb-3">所有收益已自动加入库存</p>
        <button
          onClick={() => setShow(false)}
          className="w-full border border-[hsl(var(--crt-green))/0.4] py-2 text-[hsl(var(--crt-green))] hover:bg-[hsl(var(--crt-green))/0.1] transition-colors text-xs uppercase tracking-wider">
          确认 [ENTER]
        </button>
      </div>
    </div>
  );
}
