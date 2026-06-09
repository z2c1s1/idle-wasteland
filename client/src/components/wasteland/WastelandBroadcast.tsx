import { useEffect, useState, useRef } from "react";

const EVENTS = [
  "废土商人路过避难所，用 3 瓶净水换了 1 块废铁。",
  "远处传来枪声，可能是掠夺者在交火...",
  "辐射风暴即将来临，居民们加固了避难所大门。",
  "一名流浪者请求在避难所过夜，用情报交换了住宿。",
  "地下的旧管道突然爆裂，工坊紧急抢修中。",
  "巡逻队发现了一处未被搜刮的废墟。",
  "无线电台收到一段模糊的信号：'...还有人活着吗...'",
  "变异鼠群在避难所外墙下打洞，已被驱赶。",
  "一位老人带来了战前的地图碎片，标注了水源位置。",
  "避难所的孩子们在废墟中捡到了一台还能用的收音机。",
  "警报！辐射读数上升，所有人进入室内。",
  "商队带来了种子和药品，用废铁换了一些补给。",
  "一名拾荒者从废墟中带回了一箱罐头食品。",
  "夜晚的废土格外安静，星空下避难所的灯火是唯一的温暖。",
];

export function WastelandBroadcast() {
  const [event, setEvent] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const hideRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const schedule = () => {
      const delay = 120000 + Math.random() * 300000; // 2-7 minutes
      timerRef.current = setTimeout(() => {
        const evt = EVENTS[Math.floor(Math.random() * EVENTS.length)]!;
        setEvent(evt);
        setVisible(true);
        hideRef.current = setTimeout(() => setVisible(false), 6000);
        schedule(); // schedule next
      }, delay);
    };
    schedule();
    return () => {
      clearTimeout(timerRef.current);
      clearTimeout(hideRef.current);
    };
  }, []);

  if (!event) return null;

  return (
    <div
      className={`fixed top-14 left-1/2 -translate-x-1/2 z-[9999] transition-all duration-500 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
      }`}
    >
      <div className="bg-[#0A0A08] border border-[hsl(var(--amber-warn))/0.4] rounded px-4 py-2 font-mono text-[11px] text-[hsl(var(--amber-warn))] shadow-lg max-w-md whitespace-nowrap overflow-hidden text-ellipsis"
        style={{ boxShadow: '0 0 20px rgba(200,150,50,0.1)' }}>
        <span className="text-[hsl(var(--brass))] mr-1.5">📻</span>
        {event}
      </div>
    </div>
  );
}
