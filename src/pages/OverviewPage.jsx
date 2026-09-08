// import React, { useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function OverviewPage() {
//   const navigate = useNavigate();

//   const initialFlow = [
//     { key: "source", title: "33kV Source", sub: "Grid / DG Input", incoming: 1120, outgoing: 1085, today: 18420, month: 486500 },
//     { key: "feeder", title: "33kV Feeder", sub: "HT Feeder Panel", incoming: 1085, outgoing: 1040, today: 17680, month: 462300 },
//     { key: "transformer", title: "Transformers", sub: "33kV / 433V", incoming: 1040, outgoing: 980, today: 16940, month: 441900 },
//     { key: "kiosk", title: "LT Kiosk", sub: "433V Panels", incoming: 980, outgoing: 935, today: 15720, month: 408700 },
//     { key: "busbar", title: "LT Busbar", sub: "Busduct", incoming: 935, outgoing: 900, today: 14980, month: 392100 },
//     { key: "pcc", title: "PCC Main", sub: "Wing Distribution", incoming: 900, outgoing: 850, today: 14160, month: 366400 },
//     { key: "wing1", title: "Wing 1", sub: "PCC 1 / PCC 2", incoming: 425, outgoing: 402, today: 7080, month: 181000 },
//     { key: "wing2", title: "Wing 2", sub: "PCC 3 / PCC 4", incoming: 425, outgoing: 410, today: 7420, month: 190400 },
//   ];

//   const [flowData, setFlowData] = useState(initialFlow);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setFlowData((prev) =>
//         prev.map((item) => {
//           const incoming = Math.max(
//             40,
//             item.incoming + Math.floor(Math.random() * 21) - 10
//           );

//           const outgoing = Math.min(
//             incoming - 5,
//             Math.max(35, item.outgoing + Math.floor(Math.random() * 17) - 8)
//           );

//           return {
//             ...item,
//             incoming,
//             outgoing,
//             today: item.today + Math.floor(outgoing / 75),
//             month: item.month + Math.floor(outgoing / 38),
//           };
//         })
//       );
//     }, 5000);

//     return () => clearInterval(timer);
//   }, []);

//   const totals = useMemo(() => {
//     const incoming = flowData[0].incoming;
//     const wing1 = flowData.find((x) => x.key === "wing1")?.outgoing || 0;
//     const wing2 = flowData.find((x) => x.key === "wing2")?.outgoing || 0;
//     const outgoing = wing1 + wing2;
//     const loss = incoming - outgoing;
//     const efficiency = Math.round((outgoing / incoming) * 100);
//     const today = flowData.reduce((sum, x) => sum + x.today, 0);
//     const month = flowData.reduce((sum, x) => sum + x.month, 0);

//     return { incoming, outgoing, loss, efficiency, today, month, wing1, wing2 };
//   }, [flowData]);

//   const StatCard = ({ title, value, sub, tone = "cyan" }) => (
//     <div className="relative overflow-hidden rounded-xl bg-[#081F5C] border-2 border-[#004AAD] text-white shadow-xl panel-active-glow p-5">
//       <div
//         className={`absolute -right-10 -top-10 h-28 w-28 rounded-full blur-3xl ${
//           tone === "green"
//             ? "bg-emerald-400/25"
//             : tone === "amber"
//             ? "bg-amber-400/25"
//             : "bg-cyan-400/25"
//         }`}
//       />

//       <span className="relative text-[10px] font-black text-blue-300 uppercase tracking-[0.22em]">
//         {title}
//       </span>

//       <strong className="relative block mt-2 text-2xl font-black">
//         {value}
//       </strong>

//       <span className="relative block mt-1 text-[10px] text-slate-300 uppercase">
//         {sub}
//       </span>
//     </div>
//   );

//   const TrendChart = ({ title, data }) => {
//     const max = Math.max(...data.map((x) => x.value));

//     return (
//       <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-lg">
//         <h3 className="text-[#081F5C] font-black uppercase mb-5">{title}</h3>

//         <div className="h-[240px] flex items-end gap-4 bg-slate-50 border border-slate-200 rounded-lg p-5">
//           {data.map((x) => (
//             <div
//               key={x.label}
//               className="flex-1 flex flex-col items-center justify-end gap-2 h-full"
//             >
//               <span className="text-[9px] text-[#004AAD] font-black">
//                 {Math.round(x.value / 1000)}k
//               </span>

//               <div
//                 className="w-full rounded-t-lg bg-gradient-to-t from-[#081F5C] via-[#004AAD] to-cyan-400 shadow-[0_0_14px_rgba(0,229,255,0.35)]"
//                 style={{ height: `${Math.max(25, (x.value / max) * 185)}px` }}
//               />

//               <span className="text-[10px] font-black text-[#081F5C]">
//                 {x.label}
//               </span>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   };

//   const InternalFlowChart = () => {
//     const maxIncoming = Math.max(...flowData.map((item) => item.incoming));
//     const chartHeight = 360;
//     const chartWidth = 1000;

//     const points = flowData.map((item, index) => {
//       const x = 70 + index * 125;
//       const outgoingY =
//         chartHeight - 60 - (item.outgoing / maxIncoming) * 245;
//       const incomingY =
//         chartHeight - 60 - (item.incoming / maxIncoming) * 245;
//       const lossY = chartHeight - 60 - ((item.incoming - item.outgoing) / maxIncoming) * 245;

//       return {
//         ...item,
//         x,
//         incomingY,
//         outgoingY,
//         lossY,
//         loss: item.incoming - item.outgoing,
//         efficiency: Math.round((item.outgoing / item.incoming) * 100),
//       };
//     });

//     const outgoingPath = points
//       .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.outgoingY}`)
//       .join(" ");

//     const incomingPath = points
//       .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.incomingY}`)
//       .join(" ");

//     return (
//       <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-lg">
//         <div className="mb-6">
//           <span className="text-[10px] font-black text-[#004AAD] uppercase tracking-[0.25em]">
//             Flow Wise Internal Consumption
//           </span>

//           <h3 className="text-xl font-black text-[#081F5C] uppercase mt-1">
//             Source to Wing Energy Transfer Chart
//           </h3>

//           <p className="text-xs text-slate-500 mt-1">
//             Blue line shows incoming power, cyan line shows outgoing power, and
//             amber markers show internal loss at each stage.
//           </p>
//         </div>

//         <div className="overflow-x-auto">
//           <div className="min-w-[1050px] rounded-2xl bg-gradient-to-br from-[#081F5C] via-[#061746] to-[#020617] p-6">
//             <svg
//               viewBox={`0 0 ${chartWidth} ${chartHeight}`}
//               className="w-full h-[390px]"
//               fill="none"
//             >
//               <defs>
//                 <linearGradient id="incomingLine" x1="0" x2="1">
//                   <stop offset="0%" stopColor="#60A5FA" />
//                   <stop offset="100%" stopColor="#004AAD" />
//                 </linearGradient>

//                 <linearGradient id="outgoingLine" x1="0" x2="1">
//                   <stop offset="0%" stopColor="#00E5FF" />
//                   <stop offset="100%" stopColor="#34D399" />
//                 </linearGradient>

//                 <filter id="glow">
//                   <feGaussianBlur stdDeviation="3" result="coloredBlur" />
//                   <feMerge>
//                     <feMergeNode in="coloredBlur" />
//                     <feMergeNode in="SourceGraphic" />
//                   </feMerge>
//                 </filter>
//               </defs>

//               {[0, 1, 2, 3, 4].map((i) => (
//                 <line
//                   key={i}
//                   x1="40"
//                   x2="980"
//                   y1={60 + i * 55}
//                   y2={60 + i * 55}
//                   stroke="rgba(255,255,255,0.08)"
//                   strokeWidth="1"
//                 />
//               ))}

//               <path
//                 d={incomingPath}
//                 stroke="url(#incomingLine)"
//                 strokeWidth="6"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 opacity="0.8"
//               />

//               <path
//                 d={outgoingPath}
//                 stroke="url(#outgoingLine)"
//                 strokeWidth="7"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 filter="url(#glow)"
//               />

//               {points.map((p) => (
//                 <g key={p.key}>
//                   <line
//                     x1={p.x}
//                     x2={p.x}
//                     y1={p.incomingY}
//                     y2={p.outgoingY}
//                     stroke="#FBBF24"
//                     strokeWidth="4"
//                     strokeDasharray="5 5"
//                   />

//                   <circle cx={p.x} cy={p.incomingY} r="7" fill="#60A5FA" />
//                   <circle cx={p.x} cy={p.outgoingY} r="8" fill="#00E5FF" />

//                   <circle
//                     cx={p.x}
//                     cy={(p.incomingY + p.outgoingY) / 2}
//                     r="10"
//                     fill="#F59E0B"
//                     opacity="0.95"
//                   />

//                   <text
//                     x={p.x}
//                     y={p.outgoingY - 18}
//                     textAnchor="middle"
//                     fontSize="12"
//                     fontWeight="800"
//                     fill="#E0F2FE"
//                   >
//                     {p.outgoing}kW
//                   </text>

//                   <text
//                     x={p.x}
//                     y="330"
//                     textAnchor="middle"
//                     fontSize="11"
//                     fontWeight="900"
//                     fill="#FFFFFF"
//                   >
//                     {p.title}
//                   </text>

//                   <text
//                     x={p.x}
//                     y="348"
//                     textAnchor="middle"
//                     fontSize="10"
//                     fontWeight="700"
//                     fill="#93C5FD"
//                   >
//                     Loss {p.loss}kW
//                   </text>
//                 </g>
//               ))}
//             </svg>

//             <div className="grid grid-cols-4 gap-4 mt-4">
//               <div className="bg-white/10 border border-white/10 rounded-xl p-4">
//                 <span className="text-[9px] font-black text-blue-300 uppercase tracking-wide">
//                   Incoming Line
//                 </span>
//                 <strong className="block text-white text-sm mt-1">
//                   Power received by each stage
//                 </strong>
//               </div>

//               <div className="bg-white/10 border border-white/10 rounded-xl p-4">
//                 <span className="text-[9px] font-black text-cyan-300 uppercase tracking-wide">
//                   Outgoing Line
//                 </span>
//                 <strong className="block text-white text-sm mt-1">
//                   Power transferred forward
//                 </strong>
//               </div>

//               <div className="bg-white/10 border border-white/10 rounded-xl p-4">
//                 <span className="text-[9px] font-black text-amber-300 uppercase tracking-wide">
//                   Amber Markers
//                 </span>
//                 <strong className="block text-white text-sm mt-1">
//                   Internal power loss
//                 </strong>
//               </div>

//               <div className="bg-white/10 border border-white/10 rounded-xl p-4">
//                 <span className="text-[9px] font-black text-emerald-300 uppercase tracking-wide">
//                   Live Refresh
//                 </span>
//                 <strong className="block text-white text-sm mt-1">
//                   Updates every 5 seconds
//                 </strong>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     );
//   };

//   const dailyData = [
//     { label: "Mon", value: 16400 },
//     { label: "Tue", value: 17200 },
//     { label: "Wed", value: 15800 },
//     { label: "Thu", value: 18100 },
//     { label: "Fri", value: 19200 },
//     { label: "Sat", value: 14800 },
//     { label: "Today", value: Math.round(totals.today / 8) },
//   ];

//   const monthlyData = [
//     { label: "Jan", value: 420000 },
//     { label: "Feb", value: 438000 },
//     { label: "Mar", value: 451000 },
//     { label: "Apr", value: 469000 },
//     { label: "May", value: 481000 },
//     { label: "Now", value: Math.round(totals.month / 8) },
//   ];

//   return (
//     <div className="min-h-screen bg-[#EEF4FF]">
//       <header className="sticky top-0 z-[1000] h-[72px] bg-[#081F5C] border-b-4 border-[#004AAD] px-4 text-white shadow-md">
//         <div className="h-full mx-auto max-w-7xl flex justify-between items-center">
//           <div onClick={() => navigate("/")} className="cursor-pointer">
//             <h1 className="text-[26px] font-semibold tracking-[0.18em] uppercase">
//               ARCOT <span className="text-[#67E8F9]">IIoT 1.0</span>
//             </h1>

//             <span className="text-[9px] uppercase tracking-[0.35em] text-blue-300">
//               Complete Dashboard Overview
//             </span>
//           </div>

//           <button
//             onClick={() => navigate("/")}
//             className="h-[34px] px-4 bg-[#004AAD] border border-cyan-400 text-white text-[10px] font-black uppercase tracking-[0.15em]"
//           >
//             Dashboard
//           </button>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto p-6 space-y-6">
//         <section className="bg-white border border-slate-200 rounded-xl p-5 shadow">
//           <span className="text-[10px] font-black text-[#004AAD] uppercase tracking-[0.25em]">
//             BMS Command Center
//           </span>

//           <h2 className="text-2xl font-black text-[#081F5C] uppercase mt-1">
//             Source to Wing Complete Consumption Overview
//           </h2>
//         </section>

//         <section className="grid md:grid-cols-4 gap-4">
//           <StatCard title="Total Incoming" value={`${totals.incoming} kW`} sub="Source input" />
//           <StatCard title="Final Outgoing" value={`${totals.outgoing} kW`} sub="Wing load output" tone="green" />
//           <StatCard title="Distribution Loss" value={`${totals.loss} kW`} sub="Internal losses" tone="amber" />
//           <StatCard title="Efficiency" value={`${totals.efficiency}%`} sub="Power transfer" tone="green" />
//         </section>

//         <InternalFlowChart />

//         <section className="grid lg:grid-cols-2 gap-6">
//           <TrendChart title="Daily Consumption Overview" data={dailyData} />
//           <TrendChart title="Monthly Consumption Overview" data={monthlyData} />
//         </section>

//         <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-lg">
//           <h3 className="text-lg font-black text-[#081F5C] uppercase mb-5">
//             Internal Breakdown Table
//           </h3>

//           <div className="overflow-x-auto">
//             <table className="w-full min-w-[900px] text-sm">
//               <thead>
//                 <tr className="bg-[#081F5C] text-white">
//                   <th className="p-3 text-left">Stage</th>
//                   <th className="p-3 text-right">Incoming</th>
//                   <th className="p-3 text-right">Outgoing</th>
//                   <th className="p-3 text-right">Loss</th>
//                   <th className="p-3 text-right">Today</th>
//                   <th className="p-3 text-right">Month</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {flowData.map((item) => (
//                   <tr key={item.key} className="border-b border-slate-200">
//                     <td className="p-3 font-black text-[#081F5C]">
//                       {item.title}
//                     </td>
//                     <td className="p-3 text-right">{item.incoming} kW</td>
//                     <td className="p-3 text-right text-emerald-600 font-bold">
//                       {item.outgoing} kW
//                     </td>
//                     <td className="p-3 text-right text-amber-600 font-bold">
//                       {item.incoming - item.outgoing} kW
//                     </td>
//                     <td className="p-3 text-right">
//                       {item.today.toLocaleString()} kWh
//                     </td>
//                     <td className="p-3 text-right">
//                       {item.month.toLocaleString()} kWh
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// }





// import React, { useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import prestigeLogo from "../assets/ser-removebg.png";

// export default function OverviewPage() {
//   const navigate = useNavigate();

//   const initialFlow = [
//     { key: "source", title: "33kV Source", short: "SRC", sub: "Grid / DG Input", incoming: 1120, outgoing: 1085, today: 18420, month: 486500 },
//     { key: "feeder", title: "33kV Feeder", short: "FDR", sub: "HT Feeder Panel", incoming: 1085, outgoing: 1040, today: 17680, month: 462300 },
//     { key: "transformer", title: "Transformers", short: "TRF", sub: "33kV / 433V", incoming: 1040, outgoing: 980, today: 16940, month: 441900 },
//     { key: "kiosk", title: "LT Kiosk", short: "KSK", sub: "433V Panels", incoming: 980, outgoing: 935, today: 15720, month: 408700 },
//     { key: "busbar", title: "LT Busbar", short: "BUS", sub: "Busduct", incoming: 935, outgoing: 900, today: 14980, month: 392100 },
//     { key: "pcc", title: "PCC Main", short: "PCC", sub: "Wing Distribution", incoming: 900, outgoing: 850, today: 14160, month: 366400 },
//     { key: "wing1", title: "Wing 1", short: "W1", sub: "PCC 1 / PCC 2", incoming: 425, outgoing: 402, today: 7080, month: 181000 },
//     { key: "wing2", title: "Wing 2", short: "W2", sub: "PCC 3 / PCC 4", incoming: 425, outgoing: 410, today: 7420, month: 190400 },
//   ];

//   const [flowData, setFlowData] = useState(initialFlow);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setFlowData((prev) =>
//         prev.map((item) => {
//           const incoming = Math.max(
//             40,
//             item.incoming + Math.floor(Math.random() * 21) - 10
//           );

//           const outgoing = Math.min(
//             incoming - 5,
//             Math.max(35, item.outgoing + Math.floor(Math.random() * 17) - 8)
//           );

//           return {
//             ...item,
//             incoming,
//             outgoing,
//             today: item.today + Math.floor(outgoing / 75),
//             month: item.month + Math.floor(outgoing / 38),
//           };
//         })
//       );
//     }, 5000);

//     return () => clearInterval(timer);
//   }, []);

//   const totals = useMemo(() => {
//     const incoming = flowData[0].incoming;
//     const wing1 = flowData.find((x) => x.key === "wing1")?.outgoing || 0;
//     const wing2 = flowData.find((x) => x.key === "wing2")?.outgoing || 0;
//     const outgoing = wing1 + wing2;
//     const loss = incoming - outgoing;
//     const efficiency = Math.round((outgoing / incoming) * 100);
//     const today = flowData.reduce((sum, x) => sum + x.today, 0);
//     const month = flowData.reduce((sum, x) => sum + x.month, 0);

//     return { incoming, outgoing, loss, efficiency, today, month, wing1, wing2 };
//   }, [flowData]);

//   const maxOutgoing = Math.max(...flowData.map((x) => x.outgoing));
//   const flowChartData = flowData.slice(0, 5);

//   const PanelCard = ({ title, children, className = "" }) => (
//     <section
//       className={`relative rounded-[22px] bg-white border border-slate-200 shadow-[0_14px_35px_rgba(8,31,92,0.08)] ${className}`}
//     >
//       <div className="absolute -top-[18px] left-1/2 -translate-x-1/2 w-[70%] max-w-[320px] rounded-lg bg-[#081F5C] border border-[#004AAD] px-4 py-2.5 text-center shadow-md">
//         <h3 className="text-[11px] md:text-[12px] font-bold uppercase tracking-[0.08em] text-white">
//           {title}
//         </h3>
//       </div>
//       {children}
//     </section>
//   );

//   const Gauge = ({ value, label }) => {
//     const safeValue = Math.min(Math.max(value, 0), 100);

//     return (
//       <div className="flex flex-col items-center justify-center">
//         <div className="relative w-[135px] h-[76px] overflow-hidden">
//           <div className="absolute inset-0 rounded-t-full border-[20px] border-b-0 border-slate-100" />
//           <div
//             className="absolute inset-0 rounded-t-full border-[20px] border-b-0 border-[#004AAD]"
//             style={{
//               clipPath: `polygon(0 0, ${safeValue * 2}% 0, ${safeValue * 2}% 100%, 0 100%)`,
//             }}
//           />
//           <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[30px] font-normal text-[#081F5C]">
//             {safeValue}%
//           </div>
//         </div>

//         <p className="mt-3 text-center text-[12px] font-medium text-slate-700">
//           {label}
//         </p>
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-[#EEF4FF]">
//       <header className="sticky top-0 z-[1000] h-[72px] bg-[#081F5C] border-b-4 border-[#004AAD] px-4 text-white shadow-md">
//         <div className="h-full mx-auto max-w-7xl flex items-center justify-between">
//   {/* Left Section */}
//   <div
//     onClick={() => navigate("/")}
//     className="ml-1 flex items-center cursor-pointer"
//   >
//     <div className="flex flex-col justify-center">
//       <h1 className="text-[26px] font-semibold tracking-[0.18em] text-white leading-none uppercase">
//         ARCOT
//         <span className="text-[#67E8F9] ml-2">
//           IIoT 1.0
//         </span>
//       </h1>

//       <span className="mt-1 text-[9px] uppercase tracking-[0.35em] text-blue-300 font-medium">
//         Industrial Internet of Things
//       </span>
//     </div>

//     <div className="h-[58px] border-l border-[#004AAD] ml-5"></div>

//     <img
//       src={prestigeLogo}
//       alt="Prestige Group"
//       className="h-[60px] w-[110px] object-cover ml-5"
//     />
//   </div>

//   {/* Right Section */}
//   <button
//     onClick={() => navigate("/")}
//     className="h-[36px] px-5 bg-[#004AAD] border border-cyan-400 text-white text-[10px] font-black uppercase tracking-[0.15em] hover:bg-[#0058cc] transition-all"
//   >
//     Dashboard
//   </button>
// </div>
//       </header>

//       <main className="max-w-[1380px] mx-auto px-5 md:px-6 py-7">
//         <section className="mb-8 flex items-center justify-between">
//           <div>
//             <h2 className="text-[26px] md:text-[32px] font-bold text-[#081F5C] uppercase tracking-[0.03em]">
//               BMS Analysis Report
//             </h2>
//             <p className="mt-1 text-[12px] md:text-[13px] font-medium text-slate-500">
//               Live source to wing power monitoring overview
//             </p>
//           </div>
//         </section>

//         <section className="grid grid-cols-1 xl:grid-cols-3 gap-7 mb-8 pt-4">
//           <PanelCard title="Energy Flow Growth" className="p-6 min-h-[330px]">
//             <div className="pt-8 h-[260px]">
//               <svg viewBox="0 0 430 245" className="w-full h-full">
//                 {[0, 1, 2, 3, 4].map((i) => (
//                   <line
//                     key={i}
//                     x1="42"
//                     x2="400"
//                     y1={35 + i * 40}
//                     y2={35 + i * 40}
//                     stroke="#E5E7EB"
//                     strokeWidth="1.5"
//                   />
//                 ))}

//                 <polyline
//                   points={flowChartData
//                     .map((d, i) => `${65 + i * 82},${220 - (d.outgoing / maxOutgoing) * 165}`)
//                     .join(" ")}
//                   fill="none"
//                   stroke="#004AAD"
//                   strokeWidth="4"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />

//                 {flowChartData.map((d, i) => {
//                   const y = 220 - (d.outgoing / maxOutgoing) * 165;

//                   return (
//                     <g key={d.key}>
//                       <rect
//                         x={57 + i * 82}
//                         y={y - 8}
//                         width="16"
//                         height="16"
//                         rx="3"
//                         fill="#081F5C"
//                       />
//                       <text
//                         x={65 + i * 82}
//                         y={y - 16}
//                         textAnchor="middle"
//                         fontSize="10"
//                         fontWeight="700"
//                         fill="#004AAD"
//                       >
//                         {d.outgoing}
//                       </text>
//                       <text
//                         x={65 + i * 82}
//                         y="238"
//                         textAnchor="middle"
//                         fontSize="10"
//                         fontWeight="700"
//                         fill="#081F5C"
//                       >
//                         {d.short}
//                       </text>
//                     </g>
//                   );
//                 })}
//               </svg>
//             </div>
//           </PanelCard>

//           <PanelCard title="Consumption Breakdown" className="p-6 min-h-[330px]">
//             <div className="pt-10 grid grid-cols-1 sm:grid-cols-[170px_1fr] items-center gap-5 min-h-[235px]">
//               <div className="mx-auto w-[160px] h-[160px] rounded-full bg-[conic-gradient(#67E8F9_0_24%,#004AAD_24%_48%,#081F5C_48%_70%,#60A5FA_70%_86%,#CBD5E1_86%_100%)] shadow-inner" />

//               <div className="space-y-2.5">
//                 {[
//                   ["24%", "33kV Source"],
//                   ["24%", "33kV Feeder"],
//                   ["22%", "Transformers"],
//                   ["16%", "LT Kiosk"],
//                   ["14%", "LT Busbar"],
//                 ].map(([v, label]) => (
//                   <div key={label} className="grid grid-cols-[50px_1fr] items-center gap-3 text-[13px]">
//                     <strong className="rounded-md bg-blue-50 py-1 text-center text-[#081F5C] font-semibold">
//                       {v}
//                     </strong>
//                     <span className="font-medium text-slate-600">
//                       {label}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <p className="text-[12px] text-slate-500 leading-relaxed">
//               Real-time power distribution from HT source to LT busbar and wing level output.
//             </p>
//           </PanelCard>

//           <PanelCard title="Demand Trends" className="p-6 min-h-[330px]">
//             <div className="pt-10 h-[260px] flex items-end justify-between gap-4">
//               {flowChartData.map((d) => (
//                 <div key={d.key} className="flex-1 text-center">
//                   <div className="mb-2 text-[18px] font-semibold text-[#081F5C]">
//                     {d.short}
//                   </div>

//                   <div
//                     className="mx-auto w-full max-w-[46px] rounded-t-md bg-[#004AAD] shadow-[0_0_14px_rgba(0,74,173,0.22)] transition-all duration-500"
//                     style={{
//                       height: `${Math.max(55, (d.outgoing / maxOutgoing) * 160)}px`,
//                     }}
//                   />

//                   <p className="mt-2 text-[10px] font-bold text-slate-600">
//                     {d.outgoing}kW
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </PanelCard>
//         </section>

//         <PanelCard title="Distribution Share" className="mb-8 p-6">
//           <div className="pt-12 grid grid-cols-2 md:grid-cols-5 gap-6">
//             <Gauge value={totals.efficiency} label="Efficiency" />
//             <Gauge value={Math.round((totals.wing1 / totals.outgoing) * 100)} label="Wing 1" />
//             <Gauge value={Math.round((totals.wing2 / totals.outgoing) * 100)} label="Wing 2" />
//             <Gauge value={Math.round((totals.loss / totals.incoming) * 100)} label="Loss" />
//             <Gauge value={100} label="Live System" />
//           </div>
//         </PanelCard>

//        <div className="relative pt-5">
//   <PanelCard title="Live Monitoring Summary" className="p-0">
//     <div className="pt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 text-center">
//       {[
//         ["Total Incoming", `${totals.incoming} kW`],
//         ["Final Outgoing", `${totals.outgoing} kW`],
//         ["Distribution Loss", `${totals.loss} kW`],
//         ["Efficiency", `${totals.efficiency}%`],
//         ["Today", `${totals.today.toLocaleString()} kWh`],
//         ["Month", `${totals.month.toLocaleString()} kWh`],
//       ].map(([label, value]) => (
//         <div
//           key={label}
//           className="min-h-[130px] px-4 py-6 flex flex-col items-center justify-center"
//         >
//           <p className="text-[12px] font-medium text-slate-600">
//             {label}
//           </p>
//           <h2 className="mt-3 text-[22px] md:text-[24px] font-bold text-[#004AAD] leading-tight">
//             {value}
//           </h2>
//         </div>
//       ))}
//     </div>
//   </PanelCard>
// </div>
//       </main>
//     </div>
//   );
// }





// import React, { useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import prestigeLogo from "../assets/ser-removebg.png";

// export default function OverviewPage() {
//   const navigate = useNavigate();

//   const initialFlow = [
//     { key: "source", title: "33kV Source", short: "SRC", incoming: 1120, outgoing: 1085, today: 18420, month: 486500 },
//     { key: "feeder", title: "33kV Feeder", short: "FDR", incoming: 1085, outgoing: 1040, today: 17680, month: 462300 },
//     { key: "transformer", title: "Transformers", short: "TRF", incoming: 1040, outgoing: 980, today: 16940, month: 441900 },
//     { key: "kiosk", title: "LT Kiosk", short: "KSK", incoming: 980, outgoing: 935, today: 15720, month: 408700 },
//     { key: "busbar", title: "LT Busbar", short: "BUS", incoming: 935, outgoing: 900, today: 14980, month: 392100 },
//     { key: "pcc", title: "PCC Main", short: "PCC", incoming: 900, outgoing: 850, today: 14160, month: 366400 },
//     { key: "wing1", title: "Wing 1", short: "W1", incoming: 425, outgoing: 402, today: 7080, month: 181000 },
//     { key: "wing2", title: "Wing 2", short: "W2", incoming: 425, outgoing: 410, today: 7420, month: 190400 },
//   ];

//   const [flowData, setFlowData] = useState(initialFlow);
//   const [lastUpdated, setLastUpdated] = useState(new Date());
//   const [reportView, setReportView] = useState("day");

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setFlowData((prev) =>
//         prev.map((item) => {
//           const incoming = Math.max(
//             40,
//             item.incoming + Math.floor(Math.random() * 15) - 7
//           );

//           const outgoing = Math.min(
//             incoming - 5,
//             Math.max(35, item.outgoing + Math.floor(Math.random() * 13) - 6)
//           );

//           return {
//             ...item,
//             incoming,
//             outgoing,
//             today: item.today + Math.floor(outgoing / 360),
//             month: item.month + Math.floor(outgoing / 180),
//           };
//         })
//       );

//       setLastUpdated(new Date());
//     }, 1000);

//     return () => clearInterval(timer);
//   }, []);

//   const totals = useMemo(() => {
//     const incoming = flowData[0].incoming;
//     const wing1 = flowData.find((x) => x.key === "wing1")?.outgoing || 0;
//     const wing2 = flowData.find((x) => x.key === "wing2")?.outgoing || 0;
//     const outgoing = wing1 + wing2;
//     const loss = incoming - outgoing;
//     const efficiency = Math.round((outgoing / incoming) * 100);
//     const today = flowData.reduce((sum, x) => sum + x.today, 0);
//     const month = flowData.reduce((sum, x) => sum + x.month, 0);

//     return { incoming, outgoing, loss, efficiency, today, month, wing1, wing2 };
//   }, [flowData]);

//   const maxOutgoing = Math.max(...flowData.map((x) => x.outgoing));

//   const dayReport = [
//     { label: "12 AM", value: 820 },
//     { label: "04 AM", value: 760 },
//     { label: "08 AM", value: 1010 },
//     { label: "12 PM", value: totals.outgoing },
//     { label: "04 PM", value: 940 },
//     { label: "08 PM", value: 870 },
//   ];

//   const monthReport = [
//     { label: "Week 1", value: Math.round(totals.month * 0.22) },
//     { label: "Week 2", value: Math.round(totals.month * 0.25) },
//     { label: "Week 3", value: Math.round(totals.month * 0.27) },
//     { label: "Week 4", value: Math.round(totals.month * 0.26) },
//   ];

//   const activeReport = reportView === "day" ? dayReport : monthReport;
//   const maxReport = Math.max(...activeReport.map((x) => x.value));

//   const KpiCard = ({ value, label, active = false }) => (
//     <div
//       className={`relative h-[108px] overflow-hidden rounded-[4px] px-5 py-5 text-white shadow-[0_8px_24px_rgba(0,74,173,0.25)] ${
//         active ? "bg-[#1687D9]" : "bg-[#1E46B8]"
//       }`}
//     >
//       <h2 className="text-[32px] font-light leading-none tracking-wide text-center">
//         {value}
//       </h2>

//       <p className="mt-2 text-center text-[10px] font-black uppercase tracking-[0.12em] text-blue-100">
//         {label}
//       </p>

//       <svg
//         className="absolute left-0 bottom-0 w-full h-[34px] opacity-25"
//         viewBox="0 0 260 40"
//         preserveAspectRatio="none"
//       >
//         <path
//           d="M0 28 C25 8, 45 38, 70 20 C95 3, 110 33, 135 19 C160 4, 180 36, 205 18 C230 2, 245 27, 260 13"
//           fill="none"
//           stroke="#67E8F9"
//           strokeWidth="4"
//         />
//       </svg>
//     </div>
//   );

//   const SectionTitle = ({ title, right }) => (
//     <div className="mb-5 flex items-center justify-between">
//       <h3 className="text-[17px] font-semibold text-slate-700">{title}</h3>
//       {right}
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-[#F5F9FF]">
//       <header className="sticky top-0 z-[1000] h-[72px] bg-[#081F5C] border-b-4 border-[#004AAD] px-4 text-white shadow-md">
//         <div className="h-full mx-auto max-w-7xl flex items-center justify-between">
//           <div
//             onClick={() => navigate("/")}
//             className="ml-1 flex items-center cursor-pointer"
//           >
//             <div className="flex flex-col justify-center">
//               <h1 className="text-[26px] font-semibold tracking-[0.18em] text-white leading-none uppercase">
//                 ARCOT <span className="text-[#67E8F9] ml-2">IIoT 1.0</span>
//               </h1>

//               <span className="mt-1 text-[9px] uppercase tracking-[0.35em] text-blue-300 font-medium">
//                 Industrial Internet of Things
//               </span>
//             </div>

//             <div className="h-[58px] border-l border-[#004AAD] ml-5"></div>

//             <img
//               src={prestigeLogo}
//               alt="Prestige Group"
//               className="h-[60px] w-[110px] object-cover ml-5"
//             />
//           </div>

//           <button
//             onClick={() => navigate("/")}
//             className="h-[36px] px-5 bg-[#004AAD] border border-cyan-400 text-white text-[10px] font-black uppercase tracking-[0.15em] hover:bg-[#0058cc] transition-all"
//           >
//             Dashboard
//           </button>
//         </div>
//       </header>

//       <main className="max-w-[1480px] mx-auto bg-white min-h-[calc(100vh-72px)] border-x border-blue-50 shadow-[0_0_24px_rgba(8,31,92,0.08)]">
       

//         <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-7 px-7 pt-8">
//           <KpiCard value={`${totals.incoming} kW`} label="Total Incoming" />
//           <KpiCard value={`${totals.outgoing} kW`} label="Final Outgoing" active />
//           <KpiCard value={`${totals.loss} kW`} label="Distribution Loss" />
//           <KpiCard value={`${totals.efficiency}%`} label="System Efficiency" active />
//           <KpiCard value={`${totals.today.toLocaleString()} kWh`} label="Today Energy" />
//         </section>

//         <section className="grid grid-cols-1 xl:grid-cols-[35%_60%] gap-9 px-7 pt-12">
//           <div>
//             <SectionTitle title="Power Consumption Distribution" />

//             <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] items-center gap-8 min-h-[280px]">
//               <div className="relative mx-auto w-[230px] h-[230px] rounded-full bg-[conic-gradient(#1687D9_0_22%,#1E46B8_22%_44%,#2F67E8_44%_67%,#1F78B8_67%_82%,#2048B8_82%_100%)]">
//                 <div className="absolute inset-[48px] rounded-full bg-white flex flex-col items-center justify-center">
//                   <h3 className="text-[22px] font-light text-slate-600">
//                     {totals.month.toLocaleString()}
//                   </h3>
//                   <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
//                     Month kWh
//                   </p>
//                 </div>
//               </div>

//               <div className="space-y-4">
//                 {[
//                   ["33kV Source", "#1687D9"],
//                   ["33kV Feeder", "#1E46B8"],
//                   ["Transformers", "#2F67E8"],
//                   ["LT Kiosk", "#1F78B8"],
//                   ["LT Busbar", "#2048B8"],
//                 ].map(([label, color]) => (
//                   <div key={label} className="flex items-center gap-3">
//                     <span
//                       className="h-3 w-3 rounded-full"
//                       style={{ backgroundColor: color }}
//                     />
//                     <span className="text-[13px] font-medium text-slate-500">
//                       {label}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//        <div>
//   <SectionTitle
//     title="Power Trend Analysis"
//     right={
//       <div className="flex items-center gap-5 text-[12px] text-slate-400">
//         <span className="text-[#004AAD] font-bold">Live</span>
//         <span>Day</span>
//         <span>Month</span>
//       </div>
//     }
//   />

//   <div className="h-[280px]">
//     <svg viewBox="0 0 780 280" className="w-full h-full">
//       {[0, 1, 2, 3, 4, 5].map((i) => (
//         <line
//           key={`h-${i}`}
//           x1="45"
//           x2="740"
//           y1={35 + i * 38}
//           y2={35 + i * 38}
//           stroke="#E5E7EB"
//           strokeWidth="1"
//         />
//       ))}

//       <polyline
//         points={flowData
//           .map((d, i) => {
//             const maxValue = Math.max(
//               ...flowData.flatMap((x) => [x.incoming, x.outgoing])
//             );
//             const x = 70 + i * 92;
//             const y = 245 - (d.incoming / maxValue) * 185;
//             return `${x},${y}`;
//           })
//           .join(" ")}
//         fill="none"
//         stroke="#081F5C"
//         strokeWidth="4"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />

//       <polygon
//         points={`
//           ${flowData
//             .map((d, i) => {
//               const maxValue = Math.max(
//                 ...flowData.flatMap((x) => [x.incoming, x.outgoing])
//               );
//               const x = 70 + i * 92;
//               const y = 245 - (d.outgoing / maxValue) * 185;
//               return `${x},${y}`;
//             })
//             .join(" ")}
//           ${70 + (flowData.length - 1) * 92},245
//           70,245
//         `}
//         fill="#1687D9"
//         opacity="0.22"
//       />

//       <polyline
//         points={flowData
//           .map((d, i) => {
//             const maxValue = Math.max(
//               ...flowData.flatMap((x) => [x.incoming, x.outgoing])
//             );
//             const x = 70 + i * 92;
//             const y = 245 - (d.outgoing / maxValue) * 185;
//             return `${x},${y}`;
//           })
//           .join(" ")}
//         fill="none"
//         stroke="#1687D9"
//         strokeWidth="5"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />

//       {flowData.map((d, i) => {
//         const maxValue = Math.max(
//           ...flowData.flatMap((x) => [x.incoming, x.outgoing])
//         );

//         const x = 70 + i * 92;
//         const incomingY = 245 - (d.incoming / maxValue) * 185;
//         const outgoingY = 245 - (d.outgoing / maxValue) * 185;

//         return (
//           <g key={d.key}>
//             <circle cx={x} cy={incomingY} r="5" fill="#081F5C" />
//             <circle cx={x} cy={outgoingY} r="6" fill="#1687D9" />

//             <text
//               x={x}
//               y={incomingY - 12}
//               textAnchor="middle"
//               fontSize="9"
//               fontWeight="800"
//               fill="#081F5C"
//             >
//               {d.incoming}
//             </text>

//             <text
//               x={x}
//               y={outgoingY + 20}
//               textAnchor="middle"
//               fontSize="9"
//               fontWeight="800"
//               fill="#1687D9"
//             >
//               {d.outgoing}
//             </text>

//             <text
//               x={x}
//               y="268"
//               textAnchor="middle"
//               fontSize="10"
//               fontWeight="900"
//               fill="#64748B"
//             >
//               {d.short}
//             </text>
//           </g>
//         );
//       })}

//       <circle cx="555" cy="22" r="5" fill="#081F5C" />
//       <text x="568" y="26" fontSize="11" fontWeight="700" fill="#64748B">
//         Incoming
//       </text>

//       <circle cx="650" cy="22" r="5" fill="#1687D9" />
//       <text x="663" y="26" fontSize="11" fontWeight="700" fill="#64748B">
//         Outgoing
//       </text>
//     </svg>
//   </div>

//   <div className="grid grid-cols-4 text-center pt-2">
//     {[
//       [`${totals.incoming} kW`, "Incoming"],
//       [`${totals.outgoing} kW`, "Outgoing"],
//       [`${totals.loss} kW`, "Loss"],
//       [`${totals.efficiency}%`, "Efficiency"],
//     ].map(([v, l]) => (
//       <div key={l}>
//         <h3 className="text-[20px] font-light text-slate-600">
//           {v}
//         </h3>
//         <p className="text-[11px] text-slate-300">{l}</p>
//       </div>
//     ))}
//   </div>
// </div>
//         </section>

//         <section className="grid grid-cols-1 xl:grid-cols-[40%_36%_24%] gap-8 px-7 pt-12 pb-8">
//           <div>
//             <SectionTitle title="Live Energy Monitoring" />

//             <div className="h-[245px]">
//               <svg viewBox="0 0 520 240" className="w-full h-full">
//                 <path
//                   d="M35 80 C60 65, 85 95, 110 78 C145 55, 160 125, 190 110 C225 92, 242 130, 275 105 C305 80, 325 70, 355 82 C385 95, 400 62, 430 75 C460 90, 475 125, 500 105 L500 220 L35 220 Z"
//                   fill="#BFD8EA"
//                 />
//                 <path
//                   d="M35 130 C60 120, 85 145, 110 132 C145 112, 160 168, 190 150 C225 132, 242 160, 275 140 C305 120, 325 115, 355 128 C385 140, 400 110, 430 122 C460 134, 475 160, 500 142 L500 220 L35 220 Z"
//                   fill="#2F67E8"
//                   opacity="0.85"
//                 />
//                 <path
//                   d="M35 160 C70 148, 100 172, 130 158 C165 140, 185 190, 220 172 C250 155, 275 170, 310 150 C345 130, 380 160, 410 145 C445 130, 470 175, 500 155 L500 220 L35 220 Z"
//                   fill="#1E46B8"
//                   opacity="0.92"
//                 />
//               </svg>
//             </div>
//           </div>

//           <div>
//             <SectionTitle title="Source to Wing Flow Analysis" />

//             <div className="space-y-3 pt-3">
//               {flowData.map((item) => (
//                 <div
//                   key={item.key}
//                   className="grid grid-cols-[70px_1fr_70px] items-center gap-3"
//                 >
//                   <span className="text-[12px] font-semibold text-slate-400 text-right">
//                     {item.short}
//                   </span>

//                   <div className="h-[18px] bg-slate-100">
//                     <div
//                       className="h-full bg-gradient-to-r from-[#1687D9] to-[#1E46B8] transition-all duration-500"
//                       style={{
//                         width: `${Math.max(
//                           18,
//                           (item.outgoing / maxOutgoing) * 100
//                         )}%`,
//                       }}
//                     />
//                   </div>

//                   <span className="text-[12px] font-bold text-[#081F5C]">
//                     {item.outgoing}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="relative min-h-[245px] overflow-hidden rounded-sm bg-[#1E46B8] p-6 text-white">
//             <h3 className="text-[18px] font-semibold">System Health</h3>

//             <div className="mt-5 space-y-4 relative z-10">
//               {["Source", "Feeder", "Transformer", "Kiosk", "Busbar", "PCC"].map(
//                 (item) => (
//                   <div key={item} className="flex items-center justify-between">
//                     <span className="text-[12px] font-semibold text-blue-100">
//                       {item}
//                     </span>
//                     <span className="flex items-center gap-2 text-[11px] font-bold text-cyan-100">
//                       <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
//                       Healthy
//                     </span>
//                   </div>
//                 )
//               )}
//             </div>

//             <p className="mt-5 text-[11px] text-blue-100 relative z-10">
//               Updated: {lastUpdated.toLocaleTimeString()}
//             </p>
//           </div>
//         </section>

//         <section className="px-7 pb-10">
//           <div className="rounded-[6px] border border-blue-100 bg-white shadow-[0_14px_40px_rgba(8,31,92,0.08)]">
//             <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
//               <h3 className="text-[17px] font-semibold text-slate-700">
//                 {reportView === "day"
//                   ? "Day Wise Energy Report"
//                   : "Monthly Energy Report"}
//               </h3>

//               <div className="flex rounded-full bg-blue-50 p-1">
//                 <button
//                   onClick={() => setReportView("day")}
//                   className={`px-4 py-2 text-[11px] font-black uppercase tracking-[0.12em] rounded-full ${
//                     reportView === "day"
//                       ? "bg-[#004AAD] text-white"
//                       : "text-[#004AAD]"
//                   }`}
//                 >
//                   Day Wise
//                 </button>

//                 <button
//                   onClick={() => setReportView("month")}
//                   className={`px-4 py-2 text-[11px] font-black uppercase tracking-[0.12em] rounded-full ${
//                     reportView === "month"
//                       ? "bg-[#004AAD] text-white"
//                       : "text-[#004AAD]"
//                   }`}
//                 >
//                   Monthly
//                 </button>
//               </div>
//             </div>

//             <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
//               {activeReport.map((item) => (
//                 <div
//                   key={item.label}
//                   className="grid grid-cols-[80px_1fr_110px] items-center gap-4"
//                 >
//                   <span className="text-[12px] font-bold text-slate-500">
//                     {item.label}
//                   </span>

//                   <div className="h-[18px] rounded-full bg-slate-100 overflow-hidden">
//                     <div
//                       className="h-full rounded-full bg-gradient-to-r from-[#1687D9] to-[#1E46B8] transition-all duration-700"
//                       style={{ width: `${(item.value / maxReport) * 100}%` }}
//                     />
//                   </div>

//                   <strong className="text-right text-[13px] text-[#081F5C]">
//                     {item.value.toLocaleString()} kWh
//                   </strong>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// }





// import React, { useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import prestigeLogo from "../assets/ser-removebg.png";

// export default function OverviewPage() {
//   const navigate = useNavigate();

//   const initialFlow = [
//     { key: "source", title: "33kV Source", short: "SRC", incoming: 1120, outgoing: 1085, today: 18420, month: 486500 },
//     { key: "feeder", title: "33kV Feeder", short: "FDR", incoming: 1085, outgoing: 1040, today: 17680, month: 462300 },
//     { key: "transformer", title: "Transformers", short: "TRF", incoming: 1040, outgoing: 980, today: 16940, month: 441900 },
//     { key: "kiosk", title: "LT Kiosk", short: "KSK", incoming: 980, outgoing: 935, today: 15720, month: 408700 },
//     { key: "busbar", title: "LT Busbar", short: "BUS", incoming: 935, outgoing: 900, today: 14980, month: 392100 },
//     { key: "pcc", title: "PCC Main", short: "PCC", incoming: 900, outgoing: 850, today: 14160, month: 366400 },
//     { key: "wing1", title: "Wing 1", short: "W1", incoming: 425, outgoing: 402, today: 7080, month: 181000 },
//     { key: "wing2", title: "Wing 2", short: "W2", incoming: 425, outgoing: 410, today: 7420, month: 190400 },
//   ];

//   const colors = [
//     "#1687D9",
//     "#1E46B8",
//     "#2F67E8",
//     "#1F78B8",
//     "#2048B8",
//     "#2563EB",
//     "#67E8F9",
//     "#081F5C",
//   ];

//   const [flowData, setFlowData] = useState(initialFlow);
//   const [lastUpdated, setLastUpdated] = useState(new Date());
//   const [reportView, setReportView] = useState("month");

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setFlowData((prev) =>
//         prev.map((item) => {
//           const incoming = Math.max(
//             40,
//             item.incoming + Math.floor(Math.random() * 15) - 7
//           );

//           const outgoing = Math.min(
//             incoming - 5,
//             Math.max(35, item.outgoing + Math.floor(Math.random() * 13) - 6)
//           );

//           return {
//             ...item,
//             incoming,
//             outgoing,
//             today: item.today + Math.floor(outgoing / 360),
//             month: item.month + Math.floor(outgoing / 180),
//           };
//         })
//       );

//       setLastUpdated(new Date());
//     }, 1000);

//     return () => clearInterval(timer);
//   }, []);

//   const totals = useMemo(() => {
//     const incoming = flowData[0].incoming;
//     const wing1 = flowData.find((x) => x.key === "wing1")?.outgoing || 0;
//     const wing2 = flowData.find((x) => x.key === "wing2")?.outgoing || 0;
//     const outgoing = wing1 + wing2;
//     const loss = incoming - outgoing;
//     const efficiency = Math.round((outgoing / incoming) * 100);
//     const today = flowData.reduce((sum, x) => sum + x.today, 0);
//     const month = flowData.reduce((sum, x) => sum + x.month, 0);

//     return { incoming, outgoing, loss, efficiency, today, month, wing1, wing2 };
//   }, [flowData]);

//   const maxValue = Math.max(
//     ...flowData.flatMap((x) => [x.incoming, x.outgoing])
//   );

//   const dayReport = [
//     { label: "12 AM", value: 820 },
//     { label: "04 AM", value: 760 },
//     { label: "08 AM", value: 1010 },
//     { label: "12 PM", value: totals.outgoing },
//     { label: "04 PM", value: 940 },
//     { label: "08 PM", value: 870 },
//   ];

//   const monthReport = [
//     { label: "Week 1", value: Math.round(totals.month * 0.22) },
//     { label: "Week 2", value: Math.round(totals.month * 0.25) },
//     { label: "Week 3", value: Math.round(totals.month * 0.27) },
//     { label: "Week 4", value: Math.round(totals.month * 0.26) },
//   ];

//   const activeReport = reportView === "day" ? dayReport : monthReport;
//   const maxReport = Math.max(...activeReport.map((x) => x.value));

//   const KpiCard = ({ value, label, active = false }) => (
//     <div
//       className={`relative h-[108px] overflow-hidden rounded-[4px] px-5 py-5 text-white shadow-[0_8px_24px_rgba(0,74,173,0.25)] ${
//         active ? "bg-[#1687D9]" : "bg-[#1E46B8]"
//       }`}
//     >
//       <h2 className="text-[32px] font-light leading-none tracking-wide text-center">
//         {value}
//       </h2>

//       <p className="mt-2 text-center text-[10px] font-black uppercase tracking-[0.12em] text-blue-100">
//         {label}
//       </p>

//       <svg
//         className="absolute left-0 bottom-0 w-full h-[34px] opacity-25"
//         viewBox="0 0 260 40"
//         preserveAspectRatio="none"
//       >
//         <path
//           d="M0 28 C25 8, 45 38, 70 20 C95 3, 110 33, 135 19 C160 4, 180 36, 205 18 C230 2, 245 27, 260 13"
//           fill="none"
//           stroke="#67E8F9"
//           strokeWidth="4"
//         />
//       </svg>
//     </div>
//   );

//   const SectionTitle = ({ title, right }) => (
//     <div className="mb-4 flex min-h-[38px] items-center justify-between">
//       <h3 className="text-[17px] font-semibold text-slate-700">{title}</h3>
//       {right}
//     </div>
//   );

//   return (
//     <div className="h-screen w-screen overflow-hidden bg-[#F5F9FF]">
//       <header className="h-[72px] bg-[#081F5C] border-b-4 border-[#004AAD] px-8 text-white shadow-md">
//         <div className="h-full w-full flex items-center justify-between">
//           <div
//             onClick={() => navigate("/")}
//             className="flex items-center cursor-pointer"
//           >
//             <div className="flex flex-col justify-center">
//               <h1 className="text-[26px] font-semibold tracking-[0.18em] text-white leading-none uppercase">
//                 ARCOT <span className="text-[#67E8F9] ml-2">IIoT 1.0</span>
//               </h1>

//               <span className="mt-1 text-[9px] uppercase tracking-[0.35em] text-blue-300 font-medium">
//                 Industrial Internet of Things
//               </span>
//             </div>

//             <div className="h-[58px] border-l border-[#004AAD] ml-5"></div>

//             <img
//               src={prestigeLogo}
//               alt="Prestige Group"
//               className="h-[60px] w-[110px] object-cover ml-5"
//             />
//           </div>

//           <button
//             onClick={() => navigate("/")}
//             className="h-[36px] px-6 bg-[#004AAD] border border-cyan-400 text-white text-[10px] font-black uppercase tracking-[0.15em] hover:bg-[#0058cc] transition-all"
//           >
//             Dashboard
//           </button>
//         </div>
//       </header>

//       <main className="h-[calc(100vh-72px)] w-full overflow-y-auto bg-white">
//         <div className="w-full px-8 py-8">
//           {/* KPI CARDS */}
//           <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
//             <KpiCard value={`${totals.incoming} kW`} label="Total Incoming" />
//             <KpiCard value={`${totals.outgoing} kW`} label="Final Outgoing" active />
//             <KpiCard value={`${totals.loss} kW`} label="Distribution Loss" />
//             <KpiCard value={`${totals.efficiency}%`} label="System Efficiency" active />
//             <KpiCard value={`${totals.today.toLocaleString()} kWh`} label="Today Energy" />
//           </section>

//           {/* DONUT + TREND */}
//           <section className="grid grid-cols-1 xl:grid-cols-[34%_66%] gap-8 pt-8">
//             <div>
//               <SectionTitle title="Power Consumption Distribution" />

//               <div className="grid grid-cols-1 md:grid-cols-[230px_1fr] items-center gap-6 h-[280px]">
//                 <div className="relative mx-auto w-[210px] h-[210px] rounded-full bg-[conic-gradient(#1687D9_0_14%,#1E46B8_14%_28%,#2F67E8_28%_42%,#1F78B8_42%_56%,#2048B8_56%_70%,#2563EB_70%_82%,#67E8F9_82%_91%,#081F5C_91%_100%)]">
//                   <div className="absolute inset-[44px] rounded-full bg-white flex flex-col items-center justify-center">
//                     <h3 className="text-[21px] font-light text-slate-600 leading-none">
//                       {totals.month.toLocaleString()}
//                     </h3>
//                     <p className="mt-3 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
//                       Month kWh
//                     </p>
//                   </div>
//                 </div>

//                 <div className="space-y-2.5">
//                   {flowData.map((item, index) => (
//                     <div
//                       key={item.key}
//                       className="flex items-center justify-between gap-3"
//                     >
//                       <div className="flex items-center gap-3">
//                         <span
//                           className="h-3 w-3 rounded-full shrink-0"
//                           style={{ backgroundColor: colors[index] }}
//                         />
//                         <span className="text-[12px] font-semibold text-slate-500">
//                           {item.title}
//                         </span>
//                       </div>

//                       <span className="text-[12px] font-black text-[#081F5C]">
//                         {item.outgoing} kW
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             <div>
//               <SectionTitle
//                 title="Power Trend Analysis"
//                 right={
//                   <div className="flex items-center gap-5 text-[12px] text-slate-400">
//                     <span className="text-[#004AAD] font-bold">Live</span>
//                     <span>Day</span>
//                     <span>Month</span>
//                   </div>
//                 }
//               />

//               <div className="h-[245px]">
//                 <svg viewBox="0 0 780 250" className="w-full h-full">
//                   {[0, 1, 2, 3, 4, 5].map((i) => (
//                     <line
//                       key={i}
//                       x1="45"
//                       x2="740"
//                       y1={28 + i * 34}
//                       y2={28 + i * 34}
//                       stroke="#E5E7EB"
//                     />
//                   ))}

//                   <polyline
//                     points={flowData
//                       .map((d, i) => {
//                         const x = 70 + i * 92;
//                         const y = 215 - (d.incoming / maxValue) * 160;
//                         return `${x},${y}`;
//                       })
//                       .join(" ")}
//                     fill="none"
//                     stroke="#081F5C"
//                     strokeWidth="4"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   />

//                   <polygon
//                     points={`
//                       ${flowData
//                         .map((d, i) => {
//                           const x = 70 + i * 92;
//                           const y = 215 - (d.outgoing / maxValue) * 160;
//                           return `${x},${y}`;
//                         })
//                         .join(" ")}
//                       ${70 + (flowData.length - 1) * 92},215
//                       70,215
//                     `}
//                     fill="#1687D9"
//                     opacity="0.22"
//                   />

//                   <polyline
//                     points={flowData
//                       .map((d, i) => {
//                         const x = 70 + i * 92;
//                         const y = 215 - (d.outgoing / maxValue) * 160;
//                         return `${x},${y}`;
//                       })
//                       .join(" ")}
//                     fill="none"
//                     stroke="#1687D9"
//                     strokeWidth="5"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   />

//                   {flowData.map((d, i) => {
//                     const x = 70 + i * 92;
//                     const incomingY = 215 - (d.incoming / maxValue) * 160;
//                     const outgoingY = 215 - (d.outgoing / maxValue) * 160;

//                     return (
//                       <g key={d.key}>
//                         <circle cx={x} cy={incomingY} r="5" fill="#081F5C" />
//                         <circle cx={x} cy={outgoingY} r="6" fill="#1687D9" />

//                         <text
//                           x={x}
//                           y={incomingY - 11}
//                           textAnchor="middle"
//                           fontSize="9"
//                           fontWeight="800"
//                           fill="#081F5C"
//                         >
//                           {d.incoming}
//                         </text>

//                         <text
//                           x={x}
//                           y={outgoingY + 20}
//                           textAnchor="middle"
//                           fontSize="9"
//                           fontWeight="800"
//                           fill="#1687D9"
//                         >
//                           {d.outgoing}
//                         </text>

//                         <text
//                           x={x}
//                           y="242"
//                           textAnchor="middle"
//                           fontSize="10"
//                           fontWeight="900"
//                           fill="#64748B"
//                         >
//                           {d.short}
//                         </text>
//                       </g>
//                     );
//                   })}

//                   <circle cx="555" cy="18" r="5" fill="#081F5C" />
//                   <text x="568" y="22" fontSize="11" fontWeight="700" fill="#64748B">
//                     Incoming
//                   </text>

//                   <circle cx="650" cy="18" r="5" fill="#1687D9" />
//                   <text x="663" y="22" fontSize="11" fontWeight="700" fill="#64748B">
//                     Outgoing
//                   </text>
//                 </svg>
//               </div>

//               <div className="grid grid-cols-4 text-center pt-3 border-t border-slate-100 mt-2">
//                 {[
//                   [`${totals.incoming} kW`, "Incoming"],
//                   [`${totals.outgoing} kW`, "Outgoing"],
//                   [`${totals.loss} kW`, "Loss"],
//                   [`${totals.efficiency}%`, "Efficiency"],
//                 ].map(([v, l]) => (
//                   <div key={l}>
//                     <h3 className="text-[20px] font-light text-slate-600 leading-none">
//                       {v}
//                     </h3>
//                     <p className="mt-2 text-[11px] text-slate-300">{l}</p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </section>

//           {/* BOTTOM ROW */}
//           <section className="grid grid-cols-1 xl:grid-cols-[40%_60%] gap-8 pt-8 items-stretch">
//          <div className="min-w-0">
//   <SectionTitle title="Live Energy Monitoring" />

//   <div className="h-[360px] rounded-[10px] border border-blue-100 bg-white p-6 shadow-[0_18px_40px_rgba(8,31,92,0.10)] flex flex-col overflow-hidden">
//     <div className="flex items-center justify-between shrink-0">
//       <div>
//         <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
//           Real-Time Load Curve
//         </p>
//         <h3 className="mt-2 text-[30px] font-light leading-none text-[#081F5C]">
//           {totals.outgoing} kW
//         </h3>
//       </div>

//       <div className="text-right">
//         <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
//           Updated
//         </p>
//         <p className="mt-2 text-[13px] font-bold text-[#004AAD]">
//           {lastUpdated.toLocaleTimeString()}
//         </p>
//       </div>
//     </div>

//     <div className="mt-4 flex-1 min-h-0 rounded-[8px] bg-gradient-to-b from-blue-50 to-white p-3">
//       <svg viewBox="0 0 520 190" className="w-full h-full">
//         {[0, 1, 2, 3].map((i) => (
//           <line
//             key={i}
//             x1="30"
//             x2="500"
//             y1={30 + i * 38}
//             y2={30 + i * 38}
//             stroke="#E5E7EB"
//           />
//         ))}

//         <polygon
//           points={`
//             ${flowData
//               .map((d, i) => {
//                 const x = 35 + i * 65;
//                 const y = 165 - (d.outgoing / maxValue) * 130;
//                 return `${x},${y}`;
//               })
//               .join(" ")}
//             ${35 + (flowData.length - 1) * 65},165
//             35,165
//           `}
//           fill="#1687D9"
//           opacity="0.25"
//         />

//         <polyline
//           points={flowData
//             .map((d, i) => {
//               const x = 35 + i * 65;
//               const y = 165 - (d.outgoing / maxValue) * 130;
//               return `${x},${y}`;
//             })
//             .join(" ")}
//           fill="none"
//           stroke="#004AAD"
//           strokeWidth="4"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//         />

//         {flowData.map((d, i) => {
//           const x = 35 + i * 65;
//           const y = 165 - (d.outgoing / maxValue) * 130;

//           return (
//             <g key={d.key}>
//               <circle cx={x} cy={y} r="5" fill="#081F5C" />
//               <text
//                 x={x}
//                 y="184"
//                 textAnchor="middle"
//                 fontSize="9"
//                 fontWeight="800"
//                 fill="#64748B"
//               >
//                 {d.short}
//               </text>
//             </g>
//           );
//         })}
//       </svg>
//     </div>

//     <div className="mt-4 grid grid-cols-3 gap-3 text-center shrink-0">
//       {[
//         ["Incoming", `${totals.incoming} kW`, "#081F5C"],
//         ["Outgoing", `${totals.outgoing} kW`, "#004AAD"],
//         ["Loss", `${totals.loss} kW`, "#F97316"],
//       ].map(([label, value, color]) => (
//         <div
//           key={label}
//           className="rounded-[8px] border border-slate-100 bg-slate-50 px-2 py-3"
//         >
//           <p className="text-[9px] font-black uppercase tracking-[0.12em] text-slate-400">
//             {label}
//           </p>
//           <h4
//             className="mt-2 text-[16px] font-light leading-none"
//             style={{ color }}
//           >
//             {value}
//           </h4>
//         </div>
//       ))}
//     </div>
//   </div>
// </div>

//      <div className="min-w-0">
//   <SectionTitle
//     title={reportView === "day" ? "Day Wise Energy Report" : "Monthly Energy Report"}
//     right={
//       <div className="flex rounded-full bg-blue-50 p-1 shrink-0">
//         <button
//           onClick={() => setReportView("day")}
//           className={`px-4 py-2 text-[10px] font-black uppercase tracking-[0.12em] rounded-full transition-all ${
//             reportView === "day"
//               ? "bg-[#004AAD] text-white shadow-sm"
//               : "text-[#004AAD] hover:bg-white"
//           }`}
//         >
//           Day Wise
//         </button>

//         <button
//           onClick={() => setReportView("month")}
//           className={`px-4 py-2 text-[10px] font-black uppercase tracking-[0.12em] rounded-full transition-all ${
//             reportView === "month"
//               ? "bg-[#004AAD] text-white shadow-sm"
//               : "text-[#004AAD] hover:bg-white"
//           }`}
//         >
//           Monthly
//         </button>
//       </div>
//     }
//   />

//   <div className="relative h-[360px] overflow-hidden rounded-[10px] border border-blue-100 bg-white p-6 shadow-[0_18px_40px_rgba(8,31,92,0.10)] flex flex-col">
//     <div className="absolute right-0 top-0 h-28 w-28 rounded-bl-full bg-blue-50/80" />

//     <div className="relative z-10 flex items-start justify-between">
//       <div>
//         <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
//           Consumption Graph
//         </p>
//         <h3 className="mt-2 text-[26px] font-light leading-none text-[#081F5C]">
//           {reportView === "day"
//             ? `${totals.today.toLocaleString()} kWh`
//             : `${totals.month.toLocaleString()} kWh`}
//         </h3>
//       </div>

//       <div className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1">
//         <span className="text-[10px] font-black uppercase tracking-[0.12em] text-[#004AAD]">
//           {reportView === "day" ? "Today" : "This Month"}
//         </span>
//       </div>
//     </div>

//     <div className="relative z-10 mt-5 flex-1 rounded-[8px] bg-gradient-to-b from-slate-50 to-white px-5 pt-4 pb-3">
//       <div className="absolute inset-x-5 top-1/4 border-t border-dashed border-slate-200" />
//       <div className="absolute inset-x-5 top-1/2 border-t border-dashed border-slate-200" />
//       <div className="absolute inset-x-5 top-3/4 border-t border-dashed border-slate-200" />

//       <div className="relative z-10 flex h-full items-end justify-between gap-6">
//         {activeReport.map((item) => {
//           const height = Math.max(42, (item.value / maxReport) * 160);

//           return (
//             <div key={item.label} className="flex flex-1 flex-col items-center justify-end">
//               <p className="mb-3 text-[11px] font-black text-[#081F5C]">
//                 {item.value.toLocaleString()}
//               </p>

//               <div
//                 className="w-full max-w-[76px] rounded-t-[9px] bg-gradient-to-t from-[#081F5C] via-[#004AAD] to-[#67E8F9] shadow-[0_8px_18px_rgba(0,74,173,0.22)] transition-all duration-700"
//                 style={{ height: `${height}px` }}
//               />

//               <p className="mt-3 text-[11px] font-bold text-slate-500">
//                 {item.label}
//               </p>
//             </div>
//           );
//         })}
//       </div>
//     </div>

//     <div className="relative z-10 mt-5 grid grid-cols-3 gap-4 text-center">
//       {[
//         ["Today", totals.today.toLocaleString(), "kWh", "#081F5C"],
//         ["Month", totals.month.toLocaleString(), "kWh", "#004AAD"],
//         ["Avg Week", Math.round(totals.month / 4).toLocaleString(), "kWh", "#081F5C"],
//       ].map(([label, value, unit, color]) => (
//         <div
//           key={label}
//           className="rounded-[8px] border border-blue-100 bg-blue-50/60 py-3"
//         >
//           <p className="text-[9px] font-black uppercase tracking-[0.14em] text-slate-400">
//             {label}
//           </p>
//           <h3
//             className="mt-2 text-[18px] font-light leading-none"
//             style={{ color }}
//           >
//             {value}
//           </h3>
//           <p className="mt-1 text-[9px] text-slate-400">{unit}</p>
//         </div>
//       ))}
//     </div>
//   </div>
// </div>
//           </section>
//         </div>
//       </main>
//     </div>
//   );
// }








// import React, { useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import prestigeLogo from "../assets/ser-removebg.png";

// export default function OverviewPage() {
//   const navigate = useNavigate();

//   const initialFlow = [
//     { key: "source", short: "SRC", incoming: 1120, outgoing: 1085, today: 18420 },
//     { key: "feeder", short: "FDR", incoming: 1085, outgoing: 1040, today: 17680 },
//     { key: "transformer", short: "TRF", incoming: 1040, outgoing: 980, today: 16940 },
//     { key: "kiosk", short: "KSK", incoming: 980, outgoing: 935, today: 15720 },
//     { key: "busbar", short: "BUS", incoming: 935, outgoing: 900, today: 14980 },
//     { key: "pcc", short: "PCC", incoming: 900, outgoing: 850, today: 14160 },
//     { key: "wing1", short: "W1", incoming: 425, outgoing: 402, today: 7080 },
//     { key: "wing2", short: "W2", incoming: 425, outgoing: 410, today: 7420 },
//   ];

//   const [flowData, setFlowData] = useState(initialFlow);
//   const [activeView, setActiveView] = useState("overview");
//   const [lastUpdated, setLastUpdated] = useState(new Date());

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setFlowData((prev) =>
//         prev.map((item) => {
//           const incoming = Math.max(
//             40,
//             item.incoming + Math.floor(Math.random() * 15) - 7
//           );

//           const outgoing = Math.min(
//             incoming - 5,
//             Math.max(35, item.outgoing + Math.floor(Math.random() * 13) - 6)
//           );

//           return {
//             ...item,
//             incoming,
//             outgoing,
//             today: item.today + Math.floor(outgoing / 360),
//           };
//         })
//       );

//       setLastUpdated(new Date());
//     }, 1000);

//     return () => clearInterval(timer);
//   }, []);

//   const totals = useMemo(() => {
//     const incoming = flowData[0].incoming;
//     const wing1 = flowData.find((x) => x.key === "wing1")?.outgoing || 0;
//     const wing2 = flowData.find((x) => x.key === "wing2")?.outgoing || 0;
//     const outgoing = wing1 + wing2;
//     const loss = incoming - outgoing;
//     const efficiency = Math.round((outgoing / incoming) * 100);
//     const today = flowData.reduce((sum, x) => sum + x.today, 0);

//     return { incoming, outgoing, loss, efficiency, today };
//   }, [flowData]);

//   const maxValue = Math.max(
//     ...flowData.flatMap((x) => [x.incoming, x.outgoing])
//   );

//   const kpiCards = [
//     {
//       key: "overview",
//       icon: "▦",
//       value: totals.incoming,
//       sub: `${totals.outgoing} kW`,
//       label: "All Overview",
//     },
//     {
//       key: "powerflow",
//       icon: "↯",
//       value: totals.outgoing,
//       sub: "Live Flow kW",
//       label: "Power Flow",
//     },
//     {
//       key: "efficiency",
//       icon: "◔",
//       value: `${totals.efficiency}%`,
//       sub: `${totals.loss} kW Loss`,
//       label: "Efficiency",
//     },
//     {
//       key: "energy",
//       icon: "⚡",
//       value: totals.today.toLocaleString(),
//       sub: "Today kWh",
//       label: "Energy",
//     },
//     {
//       key: "asset",
//       icon: "▣",
//       value: "8",
//       sub: "Assets Live",
//       label: "Asset Health",
//     },
//   ];

//   const taskBars = [
//     { name: "Source", value: 74, color: "#2E80B4" },
//     { name: "Feeder", value: 82, color: "#008B7C" },
//     { name: "TR Alert", value: 95, color: "#D7283A" },
//     { name: "Kiosk", value: 88, color: "#FF7A2F" },
//     { name: "Busbar", value: 62, color: "#079AA2" },
//   ];

//   const Card = ({ children, className = "" }) => (
//     <div
//       className={`h-full rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden ${className}`}
//     >
//       {children}
//     </div>
//   );

//   const Title = ({ children }) => (
//     <h3 className="text-center text-[14px] font-black text-[#132F2C] leading-none">
//       {children}
//     </h3>
//   );

//   const TopCard = ({ item }) => {
//     const active = activeView === item.key;

//     return (
//       <button
//         onClick={() => setActiveView(item.key)}
//         className={`relative h-[80px] rounded-2xl overflow-hidden border transition-all ${
//           active
//             ? "bg-[linear-gradient(135deg,#008577_0%,#15D4BD_50%,#00796D_100%)] text-white border-transparent shadow-md"
//             : "bg-white text-[#00796D] border-slate-200 shadow-sm hover:shadow-md"
//         }`}
//       >
//         <div
//           className={`absolute left-4 top-4 h-9 w-9 rounded-full flex items-center justify-center text-[18px] ${
//             active ? "bg-white/15 text-white" : "bg-[#E8F5F2] text-[#008577]"
//           }`}
//         >
//           {item.icon}
//         </div>

//         <div className="h-full flex flex-col items-center justify-center pl-8 pr-2">
//           <h2 className="text-[23px] font-light leading-none">{item.value}</h2>

//           <p className="mt-1 text-[10px] font-semibold opacity-90">
//             {item.sub}
//           </p>

//           <p
//             className={`mt-1 text-[10px] font-black ${
//               active ? "text-white" : "text-[#132F2C]"
//             }`}
//           >
//             {item.label}
//           </p>
//         </div>
//       </button>
//     );
//   };

//   const PowerFlowChart = ({ single = false }) => (
//     <Card className={single ? "p-6" : "p-4"}>
//       <Title>Power Flow Monitoring</Title>

//       <svg viewBox="0 0 820 360" className="mt-2 h-[calc(100%-22px)] w-full">
//         {[0, 1, 2, 3, 4, 5].map((i) => (
//           <g key={i}>
//             <line
//               x1="55"
//               x2="770"
//               y1={55 + i * 52}
//               y2={55 + i * 52}
//               stroke="#DCE9E6"
//             />
//             <text x="20" y={60 + i * 52} fontSize="12" fill="#4B6764">
//               {1200 - i * 240}
//             </text>
//           </g>
//         ))}

//         <text x="15" y="22" fontSize="13" fontWeight="700" fill="#132F2C">
//           kW
//         </text>

//         {flowData.map((item, i) => {
//           const x = 75 + i * 88;
//           const incomingH = (item.incoming / maxValue) * 210;
//           const outgoingH = (item.outgoing / maxValue) * 210;

//           return (
//             <g key={item.key}>
//               <rect
//                 x={x}
//                 y={300 - incomingH}
//                 width="24"
//                 height={incomingH}
//                 rx="4"
//                 fill="#9BDED5"
//                 opacity="0.75"
//               />

//               <rect
//                 x={x + 24}
//                 y={300 - outgoingH}
//                 width="24"
//                 height={outgoingH}
//                 rx="4"
//                 fill={i >= 3 ? "#008577" : "#4FBDB2"}
//               />

//               <text
//                 x={x + 24}
//                 y="333"
//                 textAnchor="middle"
//                 fontSize="12"
//                 fill="#243B3A"
//                 fontWeight="800"
//               >
//                 {item.short}
//               </text>
//             </g>
//           );
//         })}

//         <path
//           d="M76 165 C155 75 245 82 330 122 C430 172 525 240 625 245 C690 250 735 210 770 175"
//           fill="none"
//           stroke="#2085B5"
//           strokeWidth="4"
//           strokeLinecap="round"
//         />

//         <path
//           d="M76 165 C155 75 245 82 330 122 C430 172 525 240 625 245 C690 250 735 210 770 175 L770 300 L76 300 Z"
//           fill="#77D6E4"
//           opacity="0.2"
//         />

//         <g transform="translate(260 340)">
//           <rect x="0" y="0" width="14" height="14" rx="3" fill="#9BDED5" />
//           <text x="24" y="12" fontSize="13" fill="#132F2C">
//             Incoming
//           </text>

//           <rect x="130" y="0" width="14" height="14" rx="3" fill="#008577" />
//           <text x="154" y="12" fontSize="13" fill="#132F2C">
//             Outgoing
//           </text>

//           <line
//             x1="270"
//             x2="290"
//             y1="7"
//             y2="7"
//             stroke="#2085B5"
//             strokeWidth="3"
//           />
//           <text x="300" y="12" fontSize="13" fill="#132F2C">
//             Trend
//           </text>
//         </g>
//       </svg>
//     </Card>
//   );

//   const EfficiencyChart = ({ single = false }) => (
//     <Card className={single ? "p-6" : "p-4"}>
//       <Title>System Efficiency</Title>

//       <div className="h-[calc(100%-20px)] flex flex-col items-center justify-center">
//         <div
//           className={`relative rounded-full bg-[conic-gradient(#007D72_0_15%,#9BDED5_15%_100%)] shadow-[0_10px_25px_rgba(0,92,82,0.18)] ${
//             single ? "h-[300px] w-[300px]" : "h-[145px] w-[145px]"
//           }`}
//         >
//           <div
//             className={`absolute rounded-full bg-white flex items-center justify-center ${
//               single ? "inset-[58px]" : "inset-[27px]"
//             }`}
//           >
//             <h2
//               className={`${
//                 single ? "text-[48px]" : "text-[31px]"
//               } font-light text-[#008577]`}
//             >
//               {totals.efficiency}%
//             </h2>
//           </div>
//         </div>

//         <div className="mt-3 w-[78%] space-y-2">
//           <div className="flex items-center justify-between text-[12px] font-semibold">
//             <span className="flex items-center gap-2">
//               <span className="h-2.5 w-2.5 rounded-full bg-[#008577]" />
//               Efficiency
//             </span>
//             <span>{totals.efficiency}%</span>
//           </div>

//           <div className="flex items-center justify-between text-[12px] font-semibold">
//             <span className="flex items-center gap-2">
//               <span className="h-2.5 w-2.5 rounded-full bg-[#9BDED5]" />
//               Loss
//             </span>
//             <span>{totals.loss} kW</span>
//           </div>
//         </div>
//       </div>
//     </Card>
//   );

//   const EnergyChart = ({ single = false }) => {
//     const months = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

//     return (
//       <Card className={single ? "p-6" : "p-4"}>
//         <Title>Energy Performance</Title>

//         <div
//           className={`h-[calc(100%-20px)] flex items-end justify-center ${
//             single ? "gap-5" : "gap-2.5"
//           }`}
//         >
//           {months.map((m, i) => {
//             const mainH = single
//               ? 140 + ((i * 31) % 210)
//               : 45 + ((i * 31) % 92);
//             const subH = mainH * 0.48;

//             return (
//               <div key={m} className="flex flex-col items-center justify-end">
//                 <div
//                   className={`${single ? "w-10" : "w-5"} relative bg-[#61CFC4]`}
//                   style={{ height: mainH }}
//                 >
//                   <div
//                     className="absolute bottom-0 left-[4px] right-[4px] bg-[#E3FFF8]"
//                     style={{ height: subH }}
//                   />

//                   <div className="absolute left-0 right-0 bottom-[40%] h-[6px] bg-[#00998C]" />
//                 </div>

//                 <span className="mt-1 text-[10px] font-bold text-[#4B6764]">
//                   {m}
//                 </span>
//               </div>
//             );
//           })}
//         </div>
//       </Card>
//     );
//   };

//   const RadarChart = ({ single = false }) => (
//     <Card className={single ? "p-6" : "p-4"}>
//       <Title>Asset Health</Title>

//       <div className="h-[calc(100%-20px)] flex items-center justify-center">
//         <svg
//           viewBox="0 0 420 360"
//           className={single ? "h-[430px] w-[470px]" : "h-[170px] w-[220px]"}
//         >
//           <polygon points="210,35 345,130 292,305 128,305 75,130" fill="none" stroke="#B7C4C1" />
//           <polygon points="210,85 294,148 260,255 160,255 126,148" fill="none" stroke="#D4DEDC" />
//           <polygon points="210,135 246,170 232,220 188,220 174,170" fill="none" stroke="#D4DEDC" />

//           <line x1="210" y1="35" x2="210" y2="305" stroke="#C4CFCD" />
//           <line x1="75" y1="130" x2="292" y2="305" stroke="#C4CFCD" />
//           <line x1="345" y1="130" x2="128" y2="305" stroke="#C4CFCD" />

//           <polygon
//             points="210,70 265,165 270,250 145,272 100,138"
//             fill="#18C7B2"
//             opacity="0.6"
//             stroke="#00A89C"
//             strokeWidth="3"
//           />

//           <polygon
//             points="210,92 332,132 275,240 155,250 132,190"
//             fill="#E896EA"
//             opacity="0.55"
//             stroke="#B775D6"
//             strokeWidth="3"
//           />

//           <text x="210" y="20" textAnchor="middle" fontSize="13" fill="#4B6764">
//             Reliability
//           </text>
//           <text x="355" y="130" fontSize="13" fill="#4B6764">
//             Performance
//           </text>
//           <text x="275" y="330" fontSize="13" fill="#4B6764">
//             Utilization
//           </text>
//           <text x="80" y="330" fontSize="13" fill="#4B6764">
//             Safety
//           </text>
//           <text x="10" y="130" fontSize="13" fill="#4B6764">
//             Maintenance
//           </text>
//         </svg>
//       </div>
//     </Card>
//   );

//   const TaskManager = ({ single = false }) => (
//     <Card className={single ? "p-6" : "p-5"}>
//       <Title>Task Manager</Title>

//       <div className={single ? "mt-10 space-y-10" : "mt-7 space-y-6"}>
//         {taskBars.map((item) => (
//           <div
//             key={item.name}
//             className="grid grid-cols-[78px_1fr_36px] items-center gap-3"
//           >
//             <span className="text-right text-[12px] font-bold text-[#4B6764]">
//               {item.name}
//             </span>

//             <div className="h-[21px] rounded-[6px] bg-[#D9F4EF] overflow-hidden">
//               <div
//                 className="h-full rounded-[6px]"
//                 style={{ width: `${item.value}%`, backgroundColor: item.color }}
//               />
//             </div>

//             <span className="text-[12px] font-bold text-[#4B6764]">
//               {item.value}%
//             </span>
//           </div>
//         ))}
//       </div>
//     </Card>
//   );

//   const LiveEquipment = () => (
//     <Card className="p-4">
//       <Title>Live Equipment</Title>

//       <div className="grid grid-cols-2 gap-2.5 mt-3">
//         {flowData.slice(0, 4).map((item) => (
//           <div
//             key={item.key}
//             className="rounded-xl bg-[#D9F4EF] p-2 text-center"
//           >
//             <p className="text-[10px] font-black text-[#008577]">
//               {item.short}
//             </p>

//             <h4 className="text-[21px] font-light text-[#132F2C]">
//               {item.outgoing}
//             </h4>

//             <p className="text-[9px] font-bold text-[#132F2C]">kW</p>
//           </div>
//         ))}
//       </div>
//     </Card>
//   );

//   const StatusCard = ({ type }) => (
//     <Card className="p-3 flex flex-col items-center justify-center text-center">
//       <div className="mb-2 h-10 w-10 rounded-full bg-[#D9F4EF] flex items-center justify-center text-[22px] text-[#008577]">
//         {type === "time" ? "◷" : "▣"}
//       </div>

//       <p className="text-[10px] font-black text-[#4B6764]">
//         {type === "time" ? "Last Updated" : "System"}
//       </p>

//       <h4 className="mt-1 text-[15px] text-[#008577] font-medium">
//         {type === "time" ? lastUpdated.toLocaleTimeString() : "HEALTHY"}
//       </h4>

//       <p className="mt-1 text-[9px] text-[#6B7E7B]">
//         {type === "time" ? "Live Refresh" : "All Systems Normal"}
//       </p>
//     </Card>
//   );

//   const AllOverview = () => (
//     <div className="h-full grid grid-cols-[2.8fr_1fr] grid-rows-1 gap-5 min-h-0">
//       <div className="grid grid-rows-[minmax(0,1.5fr)_minmax(0,1fr)] gap-5 min-h-0">
//         <div className="grid grid-cols-[2fr_1fr] gap-5 min-h-0">
//           <PowerFlowChart />
//           <EfficiencyChart />
//         </div>

//         <div className="grid grid-cols-3 gap-5 min-h-0">
//           <EnergyChart />
//           <RadarChart />
//           <LiveEquipment />
//         </div>
//       </div>

//       <div className="grid grid-rows-[minmax(0,1fr)_110px] gap-5 min-h-0">
//         <TaskManager />

//         <div className="grid grid-cols-2 gap-5 min-h-0">
//           <StatusCard type="time" />
//           <StatusCard type="system" />
//         </div>
//       </div>
//     </div>
//   );

//   const SingleView = () => {
//     switch (activeView) {
//       case "powerflow":
//         return <PowerFlowChart single />;

//       case "efficiency":
//         return <EfficiencyChart single />;

//       case "energy":
//         return <EnergyChart single />;

//       case "asset":
//         return <RadarChart single />;

//       default:
//         return <AllOverview />;
//     }
//   };

//   return (
//     <div className="h-screen w-full overflow-hidden bg-[#F4F7FA] text-[#0B3D38]">
//       <header className="h-[58px] px-8 flex items-center justify-between bg-[#006F66] text-white">
//         <div onClick={() => navigate("/")} className="flex items-center cursor-pointer">
//           <div>
//             <h1 className="text-[24px] font-black tracking-[0.2em] uppercase leading-none">
//               ARCOT <span className="text-[#30E6D3]">IIOT 1.0</span>
//             </h1>

//             <p className="mt-1.5 text-[8px] tracking-[0.42em] uppercase text-white">
//               Industrial Internet of Things
//             </p>
//           </div>

//           <div className="mx-5 h-[42px] border-l border-white/40" />

//           <img
//             src={prestigeLogo}
//             alt="Prestige"
//             className="h-[46px] w-[90px] object-contain"
//           />
//         </div>

//         <button
//           onClick={() => navigate("/")}
//           className="rounded-full border border-white/70 px-7 py-2.5 text-[11px] font-black uppercase tracking-[0.16em]"
//         >
//           Dashboard
//         </button>
//       </header>

//       <main className="relative w-full h-[calc(100vh-58px)] px-6 py-4 overflow-hidden">
//         <aside className="absolute left-0 top-0 bottom-0 w-[72px] bg-[#006F66] flex flex-col items-center justify-start pt-10 gap-7 text-white">
//           {[
//             ["overview", "▦"],
//             ["powerflow", "↯"],
//             ["efficiency", "◔"],
//             ["energy", "⚡"],
//             ["asset", "▣"],
//           ].map(([key, icon]) => (
//             <button
//               key={key}
//               onClick={() => setActiveView(key)}
//               className={`h-10 w-10 rounded-full flex items-center justify-center text-[22px] transition ${
//                 activeView === key
//                   ? "bg-white/20 shadow-[0_0_18px_rgba(255,255,255,0.2)]"
//                   : "hover:bg-white/10"
//               }`}
//             >
//               {icon}
//             </button>
//           ))}
//         </aside>

//         <section className="pl-[90px] w-full h-full flex flex-col min-h-0">
//           <div className="grid grid-cols-5 gap-5 w-full shrink-0">
//             {kpiCards.map((item) => (
//               <TopCard key={item.key} item={item} />
//             ))}
//           </div>

//           <div className="mt-4 flex-1 min-h-0 overflow-hidden">
//             {activeView === "overview" ? <AllOverview /> : <SingleView />}
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// }





// import React, { useEffect, useMemo, useState } from "react";

// import { useNavigate } from "react-router-dom";

// import prestigeLogo from "../assets/ser-removebg.png";

// export default function OverviewPage() {

//   const navigate = useNavigate();



//   const initialFlow = [

//     { key: "source", name: "33kV Source", short: "SRC", voltage: "33.1 kV", current: 420, pf: 0.99, incoming: 1120, outgoing: 1085, today: 18420, health: 98 },

//     { key: "feeder", name: "33kV Feeder", short: "FDR", voltage: "33.0 kV", current: 388, pf: 0.98, incoming: 1085, outgoing: 1040, today: 17680, health: 97 },

//     { key: "transformer", name: "Transformer", short: "TRF", voltage: "433 V", current: 430, pf: 0.97, incoming: 1040, outgoing: 980, today: 16940, health: 96 },

//     { key: "kiosk", name: "LT Kiosk", short: "KSK", voltage: "433 V", current: 410, pf: 0.97, incoming: 980, outgoing: 935, today: 15720, health: 95 },

//     { key: "busduct", name: "Busduct", short: "BUS", voltage: "433 V", current: 390, pf: 0.98, incoming: 935, outgoing: 900, today: 14980, health: 96 },

//     { key: "pcc", name: "PCC", short: "PCC", voltage: "433 V", current: 370, pf: 0.98, incoming: 900, outgoing: 850, today: 14160, health: 95 },

//     { key: "raising", name: "Raising Main", short: "RM", voltage: "433 V", current: 340, pf: 0.97, incoming: 850, outgoing: 812, today: 13280, health: 94 },

//     { key: "wing", name: "Wing", short: "WNG", voltage: "433 V", current: 320, pf: 0.96, incoming: 812, outgoing: 780, today: 12450, health: 93 },

//   ];



//   const [flowData, setFlowData] = useState(initialFlow);

//   const [activeView, setActiveView] = useState("overview");

//   const [lastUpdated, setLastUpdated] = useState(new Date());



//   useEffect(() => {

//     const timer = setInterval(() => {

//       setFlowData((prev) =>

//         prev.map((item) => {

//           const incoming = Math.max(

//             50,

//             item.incoming + Math.floor(Math.random() * 13) - 6

//           );



//           const outgoing = Math.min(

//             incoming - 5,

//             Math.max(45, item.outgoing + Math.floor(Math.random() * 11) - 5)

//           );



//           return {

//             ...item,

//             incoming,

//             outgoing,

//             current: Math.max(20, item.current + Math.floor(Math.random() * 7) - 3),

//             today: item.today + Math.floor(outgoing / 360),

//             health: Math.min(99, Math.max(88, item.health + Math.floor(Math.random() * 3) - 1)),

//           };

//         })

//       );



//       setLastUpdated(new Date());

//     }, 1000);



//     return () => clearInterval(timer);

//   }, []);



//   const selectedItem = useMemo(

//     () => flowData.find((item) => item.key === activeView),

//     [activeView, flowData]

//   );



//   const totals = useMemo(() => {

//     const incoming = flowData[0].incoming;

//     const outgoing = flowData[flowData.length - 1].outgoing;

//     const loss = incoming - outgoing;

//     const efficiency = Math.round((outgoing / incoming) * 100);

//     const today = flowData.reduce((sum, item) => sum + item.today, 0);



//     return { incoming, outgoing, loss, efficiency, today };

//   }, [flowData]);



//   const sideItems = [

//     { key: "overview", label: "Overview", icon: "▦" },

//     { key: "source", label: "Source", icon: "S" },

//     { key: "feeder", label: "Feeder", icon: "F" },

//     { key: "transformer", label: "Transformer", icon: "T" },

//     { key: "kiosk", label: "LT Kiosk", icon: "K" },

//     { key: "busduct", label: "Busduct", icon: "B" },

//     { key: "pcc", label: "PCC", icon: "P" },

//     { key: "raising", label: "Raising Main", icon: "R" },

//     { key: "wing", label: "Wing", icon: "W" },

//   ];



//   const Card = ({ children, className = "" }) => (

//     <div className={`bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden ${className}`}>

//       {children}

//     </div>

//   );



//   const DarkCard = ({ children, className = "" }) => (

//     <div className={`bg-[#061A2D] border border-[#173F55] rounded-2xl overflow-hidden ${className}`}>

//       {children}

//     </div>

//   );



//   const MiniTrend = ({ height = 52 }) => (

//     <svg viewBox="0 0 180 52" className="w-full" style={{ height }}>

//       <path

//         d="M4 36 L22 30 L40 34 L58 22 L76 28 L94 16 L112 24 L130 15 L148 22 L176 18"

//         fill="none"

//         stroke="#00A997"

//         strokeWidth="3"

//         strokeLinecap="round"

//       />

//     </svg>

//   );



//   const PageHeader = ({ title, subtitle }) => (

//     <div className="h-[56px] px-5 flex items-center justify-between border-b border-[#173F55] bg-[#061A2D] text-white">

//       <button

//         onClick={() => setActiveView("overview")}

//         className="rounded-lg bg-[#00A997] px-4 py-2 text-[12px] font-black text-white"

//       >

//         ← Back

//       </button>



//       <div className="text-center">

//         <h2 className="text-[21px] font-black uppercase tracking-wide">{title}</h2>

//         <p className="text-[10px] text-slate-400">{subtitle}</p>

//       </div>



//       <p className="text-[12px] font-black text-[#30E6D3]">

//         ● LIVE {lastUpdated.toLocaleTimeString()}

//       </p>

//     </div>

//   );



//   const StatStrip = ({ items }) => (

//     <div

//       className="h-[86px] grid border-b border-[#173F55]"

//       style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}

//     >

//       {items.map((item) => (

//         <div

//           key={item.label}

//           className="px-4 flex flex-col justify-center border-r border-[#173F55] last:border-r-0"

//         >

//           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.12em]">

//             {item.label}

//           </p>

//           <h3 className="mt-2 text-[23px] font-light text-white">{item.value}</h3>

//           <p className="text-[10px] font-black text-[#30E6D3]">{item.sub}</p>

//         </div>

//       ))}

//     </div>

//   );



//   const OverviewSource = ({ item }) => {

//     const inc1 = Math.round(item.incoming * 0.52);

//     const inc2 = item.incoming - inc1;

//     const meter = item.outgoing;



//     return (

//       <Card className="p-4 hover:border-[#00A997] hover:shadow-lg transition cursor-pointer" onClick={() => setActiveView(item.key)}>

//         <CardHead item={item} tag="FLOW" />



//         <div className="mt-4 grid grid-cols-[1fr_1fr] gap-3">

//           <MiniValue label="INC1" value={inc1} />

//           <MiniValue label="INC2" value={inc2} />

//         </div>



//         <FlowProgress label="Outgoing" value={item.incoming} max={item.incoming} />

//         <FlowProgress label="Meter" value={meter} max={item.incoming} />



//         <p className="mt-3 text-[11px] font-black text-[#647B78]">

//           INC1 + INC2 → OUT → METER

//         </p>

//       </Card>

//     );

//   };



//   const OverviewFeeder = ({ item }) => {

//     const ogs = Array.from({ length: 6 }, (_, i) =>

//       Math.round(item.outgoing / 6 + (i - 2) * 8)

//     );



//     return (

//       <Card className="p-4 hover:border-[#00A997] hover:shadow-lg transition cursor-pointer" onClick={() => setActiveView(item.key)}>

//         <CardHead item={item} tag="6 OG" />



//         <div className="mt-4 h-[150px] flex items-end gap-2">

//           {ogs.map((v, i) => (

//             <Bar key={i} label={`OG${i + 1}`} value={v} max={Math.max(...ogs)} />

//           ))}

//         </div>

//       </Card>

//     );

//   };



//   const OverviewTransformer = ({ item }) => {

//     const loads = [68, 62, 71, 65, 74, 60];



//     return (

//       <Card className="p-4 hover:border-[#00A997] hover:shadow-lg transition cursor-pointer" onClick={() => setActiveView(item.key)}>

//         <CardHead item={item} tag="6 TR" />



//         <div className="mt-4 grid grid-cols-3 gap-3">

//           {loads.map((load, i) => (

//             <div key={i} className="rounded-xl bg-[#F4FAF9] p-3 text-center">

//               <div className="mx-auto h-12 w-12 rounded-full bg-[conic-gradient(#00A997_0_70%,#E8F5F2_70%_100%)] flex items-center justify-center">

//                 <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-[9px] font-black text-[#00796D]">

//                   {load}%

//                 </div>

//               </div>

//               <p className="mt-2 text-[9px] font-black text-[#647B78]">TR-{i + 1}</p>

//             </div>

//           ))}

//         </div>

//       </Card>

//     );

//   };



//   const OverviewKiosk = ({ item }) => {

//     const loads = [168, 154, 162, 149, 158, 144];



//     return (

//       <Card className="p-4 hover:border-[#00A997] hover:shadow-lg transition cursor-pointer" onClick={() => setActiveView(item.key)}>

//         <CardHead item={item} tag="433V" />



//         <div className="mt-4 space-y-2.5">

//           {loads.map((v, i) => (

//             <FlowProgress key={i} label={`KIOSK-${i + 1}`} value={v} max={180} small />

//           ))}

//         </div>

//       </Card>

//     );

//   };



//   const OverviewBusduct = ({ item }) => {

//     const phases = [

//       ["R", 88],

//       ["Y", 82],

//       ["B", 86],

//     ];



//     return (

//       <Card className="p-4 hover:border-[#00A997] hover:shadow-lg transition cursor-pointer" onClick={() => setActiveView(item.key)}>

//         <CardHead item={item} tag="R/Y/B" />



//         <div className="mt-5 h-[145px] flex items-end gap-5 px-8">

//           {phases.map(([p, v]) => (

//             <Bar key={p} label={p} value={v} max={100} suffix="%" />

//           ))}

//         </div>

//       </Card>

//     );

//   };



//   const OverviewPcc = ({ item }) => {

//     const wing1 = Math.round(item.outgoing * 0.48);

//     const wing2 = item.outgoing - wing1;



//     return (

//       <Card className="p-4 hover:border-[#00A997] hover:shadow-lg transition cursor-pointer" onClick={() => setActiveView(item.key)}>

//         <CardHead item={item} tag="WINGS" />



//         <div className="mt-5 grid grid-cols-[1fr_80px_1fr] gap-3 items-center">

//           <MiniValue label="WING 1" value={wing1} />

//           <div className="h-20 w-20 rounded-full bg-[#061A2D] flex flex-col items-center justify-center text-white">

//             <p className="text-[9px]">PCC</p>

//             <h4 className="text-[20px]">{item.outgoing}</h4>

//           </div>

//           <MiniValue label="WING 2" value={wing2} />

//         </div>



//         <div className="mt-5 h-3 bg-[#E8F5F2] rounded-full overflow-hidden">

//           <div className="h-full bg-[#00A997] rounded-full" style={{ width: "48%" }} />

//         </div>

//       </Card>

//     );

//   };



//   const OverviewRaising = ({ item }) => (

//     <Card className="p-4 hover:border-[#00A997] hover:shadow-lg transition cursor-pointer" onClick={() => setActiveView(item.key)}>

//       <CardHead item={item} tag="FLOORS" />



//       <div className="mt-5 h-[150px] flex items-end gap-1">

//         {Array.from({ length: 16 }).map((_, i) => {

//           const h = 35 + ((item.outgoing + i * 9) % 95);

//           return <div key={i} className="flex-1 rounded-t bg-[#00A997]" style={{ height: h }} />;

//         })}

//       </div>

//     </Card>

//   );



//   const OverviewWing = ({ item }) => (

//     <Card className="p-4 hover:border-[#00A997] hover:shadow-lg transition cursor-pointer" onClick={() => setActiveView(item.key)}>

//       <CardHead item={item} tag="HEATMAP" />



//       <div className="mt-5 grid grid-cols-5 grid-rows-4 gap-2 h-[150px]">

//         {Array.from({ length: 20 }).map((_, i) => {

//           const opacity = [0.25, 0.45, 0.7, 1][(i + item.health) % 4];

//           return <div key={i} className="rounded-lg bg-[#00A997]" style={{ opacity }} />;

//         })}

//       </div>

//     </Card>

//   );



//   const CardHead = ({ item, tag }) => (

//     <div className="flex items-start justify-between">

//       <div>

//         <p className="text-[10px] text-[#00A997] font-black tracking-[0.16em] uppercase">

//           {item.short}

//         </p>

//         <h3 className="text-[17px] font-black text-[#132F2C]">{item.name}</h3>

//       </div>



//       <span className="px-3 py-1 rounded-full bg-[#E8F5F2] text-[#00A997] text-[10px] font-black">

//         {tag}

//       </span>

//     </div>

//   );



//   const MiniValue = ({ label, value }) => (

//     <div className="rounded-xl bg-[#F4FAF9] p-3 text-center">

//       <p className="text-[9px] font-black text-[#647B78]">{label}</p>

//       <h4 className="text-[22px] font-light text-[#00796D]">{value}</h4>

//     </div>

//   );



//   const FlowProgress = ({ label, value, max, small = false }) => (

//     <div className={`${small ? "mt-0" : "mt-4"}`}>

//       <div className="flex justify-between text-[10px] font-black text-[#647B78]">

//         <span>{label}</span>

//         <span>{value} kW</span>

//       </div>

//       <div className="h-3 mt-1 bg-[#E8F5F2] rounded-full overflow-hidden">

//         <div

//           className="h-full bg-[#00A997] rounded-full"

//           style={{ width: `${Math.min(100, (value / max) * 100)}%` }}

//         />

//       </div>

//     </div>

//   );



//   const Bar = ({ label, value, max, suffix = "" }) => (

//     <div className="flex-1 flex flex-col items-center justify-end">

//       <p className="text-[10px] font-black text-[#132F2C] mb-2">

//         {value}{suffix}

//       </p>

//       <div

//         className="w-full rounded-t-lg bg-gradient-to-t from-[#00796D] to-[#30E6D3]"

//         style={{ height: `${Math.max(35, (value / max) * 110)}px` }}

//       />

//       <p className="mt-2 text-[9px] font-black text-[#647B78]">{label}</p>

//     </div>

//   );



//   const OverviewCard = ({ item }) => {

//     if (item.key === "source") return <OverviewSource item={item} />;

//     if (item.key === "feeder") return <OverviewFeeder item={item} />;

//     if (item.key === "transformer") return <OverviewTransformer item={item} />;

//     if (item.key === "kiosk") return <OverviewKiosk item={item} />;

//     if (item.key === "busduct") return <OverviewBusduct item={item} />;

//     if (item.key === "pcc") return <OverviewPcc item={item} />;

//     if (item.key === "raising") return <OverviewRaising item={item} />;

//     if (item.key === "wing") return <OverviewWing item={item} />;

//     return null;

//   };



//   const AllOverview = () => {

//     const kpis = [

//       { label: "Main Incoming", value: `${totals.incoming} kW`, sub: "33kV source input" },

//       { label: "Final Output", value: `${totals.outgoing} kW`, sub: "wing delivery" },

//       { label: "Loss", value: `${totals.loss} kW`, sub: "overall loss" },

//       { label: "Efficiency", value: `${totals.efficiency}%`, sub: "source to wing" },

//       { label: "Today Energy", value: totals.today.toLocaleString(), sub: "kWh total" },

//     ];



//     return (

//       <div className="h-full grid grid-rows-[104px_1fr] gap-4 min-h-0">

//         <div className="grid grid-cols-5 gap-4">

//           {kpis.map((item) => (

//             <DarkCard key={item.label} className="relative px-5 py-4">

//               <div className="absolute right-[-30px] top-[-30px] h-24 w-24 rounded-full bg-[#30E6D3]/10" />

//               <p className="text-[10px] font-black text-[#30E6D3] uppercase tracking-[0.16em]">

//                 {item.label}

//               </p>

//               <h2 className="mt-2 text-[26px] font-light text-white">{item.value}</h2>

//               <p className="mt-1 text-[10px] font-bold text-slate-300">{item.sub}</p>

//             </DarkCard>

//           ))}

//         </div>



//         <div className="grid grid-cols-4 grid-rows-2 gap-4 min-h-0">

//           {flowData.map((item) => (

//             <OverviewCard key={item.key} item={item} />

//           ))}

//         </div>

//       </div>

//     );

//   };



//   const SourceDashboard = ({ item }) => {

//     const inc1 = Math.round(item.incoming * 0.52);

//     const inc2 = item.incoming - inc1;

//     const meter = item.outgoing;

//     const feeder = item.outgoing - 8;

//     const loss = item.incoming - feeder;

//     const efficiency = ((feeder / item.incoming) * 100).toFixed(1);



//     return (

//       <DashboardShell

//         title="33kV Source Analytical Dashboard"

//         subtitle="INC1 + INC2 → Outgoing → Meter → Feeder"

//         stats={[

//           { label: "INC1", value: `${inc1} kW`, sub: "source input" },

//           { label: "INC2", value: `${inc2} kW`, sub: "source input" },

//           { label: "Outgoing", value: `${item.incoming} kW`, sub: "combined" },

//           { label: "Meter", value: `${meter} kW`, sub: "meter reading" },

//           { label: "Feeder", value: `${feeder} kW`, sub: "final output" },

//           { label: "Loss", value: `${loss} kW`, sub: `${efficiency}% efficient` },

//         ]}

//       >

//         <section className="p-5 border-r border-[#173F55]">

//           <SectionTitle title="Flow Comparison" />

//           <div className="h-[calc(100%-32px)] flex items-end gap-5">

//             {[

//               ["INC1", inc1],

//               ["INC2", inc2],

//               ["OUT", item.incoming],

//               ["METER", meter],

//               ["FEEDER", feeder],

//             ].map(([label, value]) => (

//               <DashBar key={label} label={label} value={value} max={item.incoming} />

//             ))}

//           </div>

//         </section>



//         <section className="p-5 border-r border-[#173F55]">

//           <SectionTitle title="Live Power Trend" />

//           <LargeLineChart />

//         </section>



//         <section className="grid grid-rows-2">

//           <div className="p-5 border-b border-[#173F55]">

//             <SectionTitle title="Incoming Share" />

//             <Donut center={item.incoming} />

//           </div>



//           <div className="p-5">

//             <SectionTitle title="Electrical Values" />

//             <ParameterRows rows={[

//               ["Voltage", item.voltage],

//               ["Current", `${item.current} A`],

//               ["PF", item.pf],

//               ["Today", `${item.today.toLocaleString()} kWh`],

//             ]} />

//           </div>

//         </section>

//       </DashboardShell>

//     );

//   };



//   const FeederDashboard = ({ item }) => {

//     const ogs = Array.from({ length: 6 }, (_, i) => ({

//       name: `OG-${i + 1}`,

//       value: Math.round(item.outgoing / 6 + (i - 2) * 8),

//     }));



//     return (

//       <DashboardShell

//         title="33kV Feeder Analytical Dashboard"

//         subtitle="1 Incoming feeder → 6 outgoing feeders"

//         stats={[

//           { label: "Incoming", value: `${item.incoming} kW`, sub: "input" },

//           { label: "Outgoing", value: `${item.outgoing} kW`, sub: "OG total" },

//           { label: "Loss", value: `${item.incoming - item.outgoing} kW`, sub: "feeder loss" },

//           { label: "Voltage", value: item.voltage, sub: "stable" },

//           { label: "Current", value: `${item.current} A`, sub: "live" },

//           { label: "PF", value: item.pf, sub: "healthy" },

//         ]}

//       >

//         <section className="p-6 border-r border-[#173F55] col-span-2">

//           <SectionTitle title="OG1 - OG6 Outgoing Load" />

//           <div className="h-[calc(100%-35px)] flex items-end gap-8">

//             {ogs.map((x) => (

//               <DashBar key={x.name} label={x.name} value={x.value} max={Math.max(...ogs.map((o) => o.value))} />

//             ))}

//           </div>

//         </section>



//         <section className="grid grid-rows-2">

//           <div className="p-6 border-b border-[#173F55]">

//             <SectionTitle title="Feeder Trend" />

//             <MiniTrend height={170} />

//           </div>

//           <Insight text="OG feeders are balanced. No outgoing feeder is overloaded. Feeder loss is within normal range." />

//         </section>

//       </DashboardShell>

//     );

//   };



//   const TransformerDashboard = ({ item }) => {

//     const transformers = [

//       ["TR-1", 68, 54, 61],

//       ["TR-2", 62, 52, 59],

//       ["TR-3", 71, 55, 60],

//       ["TR-4", 65, 53, 58],

//       ["TR-5", 74, 56, 63],

//       ["TR-6", 60, 51, 57],

//     ];



//     return (

//       <DashboardShell

//         title="Transformer Analytical Dashboard"

//         subtitle="Transformer load, oil temperature, winding temperature and relay health"

//         stats={[

//           { label: "Input", value: `${item.incoming} kW`, sub: "33kV side" },

//           { label: "Output", value: `${item.outgoing} kW`, sub: "433V side" },

//           { label: "Avg Load", value: "66.7%", sub: "normal" },

//           { label: "Max Oil", value: "56°C", sub: "safe" },

//           { label: "Max Winding", value: "63°C", sub: "safe" },

//           { label: "Relay", value: "Healthy", sub: "buchholz" },

//         ]}

//       >

//         <section className="p-5 border-r border-[#173F55] col-span-2">

//           <SectionTitle title="Transformer Load Profile" />

//           <div className="grid grid-cols-3 gap-4">

//             {transformers.map(([name, load, oil, winding]) => (

//               <div key={name} className="bg-[#071D33] border border-[#173F55] rounded-2xl p-4">

//                 <div className="flex justify-between">

//                   <h4 className="font-black">{name}</h4>

//                   <span className="text-[#30E6D3] text-[10px] font-black">LIVE</span>

//                 </div>



//                 <div className="mt-4 mx-auto h-20 w-20 rounded-full bg-[conic-gradient(#00A997_0_70%,#173F55_70%_100%)] flex items-center justify-center">

//                   <div className="h-14 w-14 rounded-full bg-[#061A2D] flex items-center justify-center font-black text-[#30E6D3]">

//                     {load}%

//                   </div>

//                 </div>



//                 <div className="mt-3 text-[10px] space-y-1.5">

//                   <p className="flex justify-between"><span className="text-slate-400">Oil</span><b>{oil}°C</b></p>

//                   <p className="flex justify-between"><span className="text-slate-400">Winding</span><b>{winding}°C</b></p>

//                 </div>

//               </div>

//             ))}

//           </div>

//         </section>



//         <section className="p-6">

//           <SectionTitle title="Temperature Trend" />

//           <LargeLineChart />

//           <p className="mt-3 text-[13px] text-slate-300">

//             All transformers are operating within safe temperature and load limits.

//           </p>

//         </section>

//       </DashboardShell>

//     );

//   };



//   const DistributionDashboard = ({ item, title, subtitle, blocks = 6 }) => {

//     const loads = Array.from({ length: blocks }, (_, i) =>

//       Math.round(item.outgoing / blocks + (i - 2) * 9)

//     );



//     return (

//       <DashboardShell

//         title={title}

//         subtitle={subtitle}

//         stats={[

//           { label: "Incoming", value: `${item.incoming} kW`, sub: "input" },

//           { label: "Outgoing", value: `${item.outgoing} kW`, sub: "output" },

//           { label: "Loss", value: `${item.incoming - item.outgoing} kW`, sub: "loss" },

//           { label: "Voltage", value: item.voltage, sub: "stable" },

//           { label: "Current", value: `${item.current} A`, sub: "live" },

//           { label: "PF", value: item.pf, sub: "healthy" },

//         ]}

//       >

//         <section className="p-6 border-r border-[#173F55] col-span-2">

//           <SectionTitle title="Load Distribution" />

//           <div className="h-[calc(100%-35px)] flex items-end gap-5">

//             {loads.map((v, i) => (

//               <DashBar key={i} label={`#${i + 1}`} value={v} max={Math.max(...loads)} />

//             ))}

//           </div>

//         </section>



//         <section className="grid grid-rows-2">

//           <div className="p-6 border-b border-[#173F55]">

//             <SectionTitle title="Consumption Trend" />

//             <MiniTrend height={170} />

//           </div>

//           <Insight text="Distribution is balanced. No abnormal load deviation is detected in this section." />

//         </section>

//       </DashboardShell>

//     );

//   };



//   const WingDashboard = ({ item }) => (

//     <DashboardShell

//       title="Wing Analytical Dashboard"

//       subtitle="Floor, zone and client consumption heatmap"

//       stats={[

//         { label: "Incoming", value: `${item.incoming} kW`, sub: "wing input" },

//         { label: "Output", value: `${item.outgoing} kW`, sub: "usage" },

//         { label: "Floors", value: "20", sub: "active" },

//         { label: "Zones", value: "40", sub: "monitored" },

//         { label: "Today", value: `${item.today.toLocaleString()} kWh`, sub: "energy" },

//         { label: "Health", value: `${item.health}%`, sub: "normal" },

//       ]}

//     >

//       <section className="p-6 border-r border-[#173F55] col-span-2">

//         <SectionTitle title="Zone Heatmap" />

//         <div className="grid grid-cols-8 grid-rows-5 gap-3 h-[calc(100%-35px)]">

//           {Array.from({ length: 40 }).map((_, i) => {

//             const opacity = [0.25, 0.42, 0.66, 1][(i + item.health) % 4];

//             return (

//               <div key={i} className="rounded-xl bg-[#00A997] flex items-center justify-center text-[10px] font-black" style={{ opacity }}>

//                 {i + 1}

//               </div>

//             );

//           })}

//         </div>

//       </section>



//       <section className="p-6">

//         <SectionTitle title="Floor Consumption" />

//         <div className="h-[300px] flex items-end gap-2">

//           {Array.from({ length: 20 }).map((_, i) => {

//             const h = 50 + ((item.outgoing + i * 11) % 230);

//             return <div key={i} className="flex-1 rounded-t bg-[#00A997]" style={{ height: h }} />;

//           })}

//         </div>

//       </section>

//     </DashboardShell>

//   );



//   const DashboardShell = ({ title, subtitle, stats, children }) => (

//     <div className="h-full bg-[#061A2D] text-white overflow-hidden">

//       <PageHeader title={title} subtitle={subtitle} />

//       <StatStrip items={stats} />

//       <div className="h-[calc(100%-142px)] grid grid-cols-[36%_36%_28%]">

//         {children}

//       </div>

//     </div>

//   );



//   const SectionTitle = ({ title }) => (

//     <h3 className="text-[13px] font-black mb-4 uppercase tracking-[0.08em]">{title}</h3>

//   );



//   const DashBar = ({ label, value, max }) => (

//     <div className="flex-1 flex flex-col items-center justify-end">

//       <p className="text-[11px] font-black mb-2">{value}</p>

//       <div

//         className="w-full rounded-t-2xl bg-gradient-to-t from-[#00796D] to-[#30E6D3]"

//         style={{ height: `${Math.max(55, (value / max) * 320)}px` }}

//       />

//       <p className="mt-3 text-[10px] text-slate-300 font-black">{label}</p>

//     </div>

//   );



//   const LargeLineChart = () => (

//     <svg viewBox="0 0 720 400" className="w-full h-[calc(100%-34px)]">

//       {[80, 160, 240, 320].map((y) => (

//         <line key={y} x1="40" x2="700" y1={y} y2={y} stroke="#173F55" />

//       ))}

//       <path d="M40 310 C130 280,220 210,310 130 C420 65,535 85,625 145 C670 180,690 240,705 300" fill="none" stroke="#30E6D3" strokeWidth="5" />

//       <path d="M40 345 C130 320,220 260,310 190 C420 135,535 150,625 205 C670 240,690 295,705 340" fill="none" stroke="#00A997" strokeWidth="4" />

//       <path d="M40 370 C130 350,220 310,310 250 C420 205,535 215,625 265 C670 300,690 340,705 370" fill="none" stroke="#00796D" strokeWidth="4" />

//     </svg>

//   );



//   const Donut = ({ center }) => (

//     <div className="flex items-center justify-center">

//       <div className="h-[170px] w-[170px] rounded-full bg-[conic-gradient(#30E6D3_0_52%,#00796D_52%_100%)] flex items-center justify-center">

//         <div className="h-[108px] w-[108px] rounded-full bg-[#061A2D] border border-[#173F55] flex flex-col items-center justify-center">

//           <p className="text-[10px] text-slate-400">TOTAL</p>

//           <h3 className="text-[28px] font-light">{center}</h3>

//           <p className="text-[10px] text-slate-400">kW</p>

//         </div>

//       </div>

//     </div>

//   );



//   const ParameterRows = ({ rows }) => (

//     <div>

//       {rows.map(([label, value]) => (

//         <div key={label} className="flex justify-between border-b border-[#173F55] py-3">

//           <span className="text-slate-400 text-[11px]">{label}</span>

//           <span className="font-black">{value}</span>

//         </div>

//       ))}

//     </div>

//   );



//   const Insight = ({ text }) => (

//     <div className="p-6">

//       <SectionTitle title="Insight" />

//       <p className="text-[13px] text-slate-300 leading-relaxed">{text}</p>

//       <h2 className="mt-6 text-[30px] font-light text-[#30E6D3]">HEALTHY</h2>

//     </div>

//   );



//   const ComponentDetail = () => {

//     if (!selectedItem) return null;



//     if (selectedItem.key === "source") return <SourceDashboard item={selectedItem} />;

//     if (selectedItem.key === "feeder") return <FeederDashboard item={selectedItem} />;

//     if (selectedItem.key === "transformer") return <TransformerDashboard item={selectedItem} />;

//     if (selectedItem.key === "kiosk") return <DistributionDashboard item={selectedItem} title="LT Kiosk Analytical Dashboard" subtitle="Kiosk-wise 433V distribution analytics" />;

//     if (selectedItem.key === "busduct") return <DistributionDashboard item={selectedItem} title="Busduct Analytical Dashboard" subtitle="Busduct phase and load analytics" />;

//     if (selectedItem.key === "pcc") return <DistributionDashboard item={selectedItem} title="PCC Analytical Dashboard" subtitle="PCC to wing split and outgoing analytics" blocks={4} />;

//     if (selectedItem.key === "raising") return <DistributionDashboard item={selectedItem} title="Raising Main Analytical Dashboard" subtitle="Floor-wise rising main consumption analytics" blocks={10} />;

//     if (selectedItem.key === "wing") return <WingDashboard item={selectedItem} />;



//     return null;

//   };



//   return (

//     <div className="h-screen w-full overflow-hidden bg-[#F4F7FA] text-[#0B3D38]">

//       <header className="h-[58px] px-8 flex items-center justify-between bg-[#006F66] text-white">

//         <div onClick={() => navigate("/")} className="flex items-center cursor-pointer">

//           <div>

//             <h1 className="text-[24px] font-black tracking-[0.2em] uppercase leading-none">

//               ARCOT <span className="text-[#30E6D3]">IIOT 1.0</span>

//             </h1>

//             <p className="mt-1.5 text-[8px] tracking-[0.42em] uppercase text-white">

//               Industrial Internet of Things

//             </p>

//           </div>



//           <div className="mx-5 h-[42px] border-l border-white/40" />



//           <img src={prestigeLogo} alt="Prestige" className="h-[46px] w-[90px] object-contain" />

//         </div>



//         <button

//           onClick={() => navigate("/")}

//           className="rounded-full border border-white/70 px-7 py-2.5 text-[11px] font-black uppercase tracking-[0.16em]"

//         >

//           Dashboard

//         </button>

//       </header>



//       <main className="relative w-full h-[calc(100vh-58px)] overflow-hidden">

//         <aside className="absolute left-0 top-0 bottom-0 w-[210px] bg-[#006F66] px-3 py-5 text-white">

//           <div className="mb-5 px-3">

//             <p className="text-[10px] font-black tracking-[0.22em] uppercase text-white/70">

//               Components

//             </p>

//           </div>



//           <div className="flex flex-col gap-2">

//             {sideItems.map((item) => (

//               <button

//                 key={item.key}

//                 onClick={() => setActiveView(item.key)}

//                 className={`h-11 w-full rounded-xl flex items-center gap-3 px-3 text-left transition ${

//                   activeView === item.key

//                     ? "bg-white text-[#006F66] shadow-md"

//                     : "text-white hover:bg-white/10"

//                 }`}

//               >

//                 <span

//                   className={`h-7 w-7 rounded-lg flex items-center justify-center text-[12px] font-black ${

//                     activeView === item.key

//                       ? "bg-[#E8F5F2] text-[#006F66]"

//                       : "bg-white/10 text-white"

//                   }`}

//                 >

//                   {item.icon}

//                 </span>



//                 <span className="text-[12px] font-black">{item.label}</span>

//               </button>

//             ))}

//           </div>

//         </aside>



// <section

//   className={`ml-[210px] w-[calc(100%-210px)] h-full overflow-hidden ${

//     activeView === "overview" ? "px-6 py-4 bg-[#F4F7FA]" : "p-0 bg-[#061A2D]"

//   }`}

// >          {activeView === "overview" ? <AllOverview /> : <ComponentDetail />}

//         </section>

//       </main>

//     </div>

//   );

// }








// import React, { useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import prestigeLogo from "../assets/ser-removebg.png";


// const EQUIPMENT_OPTIONS = [
//   { key: "system", label: "Entire System" },
//   { key: "source", label: "33kV Source" },
//   { key: "feeder", label: "33kV Feeder" },
//   { key: "transformer", label: "Transformer" },
//   { key: "kiosk", label: "LT Kiosk" },
//   { key: "busbar", label: "LT Busbar" },
//   { key: "pcc", label: "PCC Main" },
//   { key: "wing-a", label: "Wing A" },
//   { key: "wing-b", label: "Wing B" },
//   { key: "chillers", label: "Chillers" },
// ];

// const EQUIPMENT_MULTIPLIERS = {
//   system: 1,
//   source: 0.98,
//   feeder: 0.94,
//   transformer: 0.89,
//   kiosk: 0.84,
//   busbar: 0.81,
//   pcc: 0.77,
//   "wing-a": 0.30,
//   "wing-b": 0.28,
//   chillers: 0.19,
// };

// const formatDateKey = (date) => {
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, "0");
//   const day = String(date.getDate()).padStart(2, "0");
//   return `${year}-${month}-${day}`;
// };

// const getCurrentMonth = () => {
//   const date = new Date();
//   return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
// };

// const generateAnalyticsData = () => {
//   const rows = [];
//   const today = new Date();

//   for (let dayOffset = 60; dayOffset >= 0; dayOffset -= 1) {
//     const date = new Date(today);
//     date.setDate(today.getDate() - dayOffset);
//     const dateKey = formatDateKey(date);

//     EQUIPMENT_OPTIONS.forEach((equipment, equipmentIndex) => {
//       const multiplier = EQUIPMENT_MULTIPLIERS[equipment.key];

//       for (let hour = 0; hour < 24; hour += 1) {
//         const daylightFactor =
//           hour >= 6 && hour <= 22
//             ? 0.72 + Math.sin(((hour - 6) / 16) * Math.PI) * 0.38
//             : 0.52;

//         const weekdayFactor =
//           date.getDay() === 0 || date.getDay() === 6 ? 0.88 : 1;

//         const baseIncoming =
//           1080 *
//           multiplier *
//           daylightFactor *
//           weekdayFactor;

//         const dailyNoise =
//           ((dayOffset * 13 + hour * 7 + equipmentIndex * 11) % 35) - 17;

//         const incomingKw = Math.max(
//           30,
//           Math.round(baseIncoming + dailyNoise)
//         );

//         const lossRatio =
//           equipment.key === "system"
//             ? 0.085
//             : 0.025 + equipmentIndex * 0.004;

//         const outgoingKw = Math.max(
//           20,
//           Math.round(incomingKw * (1 - lossRatio))
//         );

//         const energyKwh = Number(
//           ((incomingKw + outgoingKw) / 2).toFixed(2)
//         );

//         const voltageBase =
//           equipment.key === "source" || equipment.key === "feeder"
//             ? 33000
//             : 433;

//         const voltageVariation =
//           equipment.key === "source" || equipment.key === "feeder"
//             ? ((hour + dayOffset) % 9) * 18 - 72
//             : ((hour + equipmentIndex) % 7) - 3;

//         const voltage = voltageBase + voltageVariation;
//         const current = Number(
//           (
//             (outgoingKw * 1000) /
//             (Math.sqrt(3) *
//               voltage *
//               (0.95 + (equipmentIndex % 3) * 0.01))
//           ).toFixed(2)
//         );

//         const powerFactor = Number(
//           (0.95 + ((hour + equipmentIndex) % 4) * 0.01).toFixed(2)
//         );

//         const timestamp = `${dateKey}T${String(hour).padStart(2, "0")}:00:00`;

//         rows.push({
//           timestamp,
//           equipment: equipment.key,
//           equipmentLabel: equipment.label,
//           incomingKw,
//           outgoingKw,
//           energyKwh,
//           voltage,
//           current,
//           powerFactor,
//           status:
//             outgoingKw / incomingKw < 0.88
//               ? "Attention"
//               : "Normal",
//         });
//       }
//     });
//   }

//   return rows;
// };

// const ANALYTICS_DATA = generateAnalyticsData();


// const Card = ({ children, className = "" }) => (
//   <div
//     className={`overflow-hidden rounded-[18px] border border-[#D7E4F2] bg-white shadow-[0_10px_28px_rgba(8,31,92,0.07)] ${className}`}
//   >
//     {children}
//   </div>
// );

// const SectionTitle = ({ title, subtitle, rightContent }) => (
//   <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
//     <div>
//       <h2 className="text-[15px] font-semibold text-[#081F5C]">
//         {title}
//       </h2>
//       {subtitle && (
//         <p className="mt-1 text-[10px] leading-relaxed text-[#6B7F99]">
//           {subtitle}
//         </p>
//       )}
//     </div>
//     {rightContent}
//   </div>
// );

// const MetricCard = ({
//   label,
//   value,
//   unit,
//   helper,
//   tone = "blue",
// }) => {
//   const toneMap = {
//     blue: ["text-[#2563EB]", "bg-[#2563EB]"],
//     cyan: ["text-[#0891B2]", "bg-[#22D3EE]"],
//     green: ["text-[#15805F]", "bg-[#34D399]"],
//     amber: ["text-[#B7791F]", "bg-[#FBBF24]"],
//     red: ["text-[#B42318]", "bg-[#F87171]"],
//   };

//   const [valueClass, accentClass] =
//     toneMap[tone] || toneMap.blue;

//   return (
//     <Card className="relative p-4">
//       <div className={`absolute inset-y-0 left-0 w-1 ${accentClass}`} />

//       <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#6B7F99]">
//         {label}
//       </p>

//       <div className="mt-3 flex items-end gap-2">
//         <h3 className={`text-[29px] font-semibold leading-none ${valueClass}`}>
//           {value}
//         </h3>
//         {unit && (
//           <span className="pb-1 text-[9px] font-semibold uppercase text-[#8292A8]">
//             {unit}
//           </span>
//         )}
//       </div>

//       <p className="mt-3 text-[9px] leading-relaxed text-[#8292A8]">
//         {helper}
//       </p>
//     </Card>
//   );
// };

// const TrendChart = ({ rows }) => {
//   if (!rows.length) {
//     return (
//       <div className="flex h-[260px] items-center justify-center text-[11px] text-[#6B7F99]">
//         No analytics data found for the selected filters.
//       </div>
//     );
//   }

//   const width = 820;
//   const height = 270;
//   const left = 58;
//   const right = 790;
//   const top = 24;
//   const bottom = 215;
//   const chartWidth = right - left;
//   const chartHeight = bottom - top;

//   const maxValue = Math.max(
//     ...rows.flatMap((row) => [row.incomingKw, row.outgoingKw]),
//     1
//   );

//   const step = Math.max(1, Math.ceil(rows.length / 24));
//   const chartRows = rows.filter(
//     (_, index) => index % step === 0 || index === rows.length - 1
//   );

//   const coordinates = chartRows.map((row, index) => {
//     const x =
//       chartRows.length === 1
//         ? left
//         : left + (index / (chartRows.length - 1)) * chartWidth;

//     return {
//       x,
//       incomingY:
//         bottom - (Number(row.incomingKw) / maxValue) * chartHeight,
//       outgoingY:
//         bottom - (Number(row.outgoingKw) / maxValue) * chartHeight,
//       row,
//     };
//   });

//   const incomingPoints = coordinates
//     .map((item) => `${item.x},${item.incomingY}`)
//     .join(" ");

//   const outgoingPoints = coordinates
//     .map((item) => `${item.x},${item.outgoingY}`)
//     .join(" ");

//   const labelStep = Math.max(1, Math.ceil(coordinates.length / 7));

//   return (
//     <svg viewBox={`0 0 ${width} ${height}`} className="h-[270px] w-full">
//       {[0, 1, 2, 3, 4].map((index) => {
//         const y = top + index * (chartHeight / 4);
//         const value = maxValue - index * (maxValue / 4);

//         return (
//           <React.Fragment key={index}>
//             <line
//               x1={left}
//               x2={right}
//               y1={y}
//               y2={y}
//               stroke="rgba(107,127,153,0.16)"
//               strokeDasharray="4 4"
//             />
//             <text
//               x={left - 8}
//               y={y + 3}
//               textAnchor="end"
//               fontSize="8"
//               fill="#8292A8"
//             >
//               {Math.round(value)}
//             </text>
//           </React.Fragment>
//         );
//       })}

//       <polyline
//         points={incomingPoints}
//         fill="none"
//         stroke="#F59E0B"
//         strokeWidth="3"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />

//       <polyline
//         points={outgoingPoints}
//         fill="none"
//         stroke="#2563EB"
//         strokeWidth="3"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />

//       {coordinates.map((item, index) => (
//         <g key={`${item.row.timestamp}-${index}`}>
//           <circle
//             cx={item.x}
//             cy={item.incomingY}
//             r="3"
//             fill="#F59E0B"
//           />
//           <circle
//             cx={item.x}
//             cy={item.outgoingY}
//             r="3"
//             fill="#2563EB"
//           />

//           <title>
//             {`${new Date(item.row.timestamp).toLocaleString()} | Incoming ${item.row.incomingKw} kW | Outgoing ${item.row.outgoingKw} kW`}
//           </title>

//           {(index % labelStep === 0 ||
//             index === coordinates.length - 1) && (
//             <text
//               x={item.x}
//               y="240"
//               textAnchor="middle"
//               fontSize="8"
//               fill="#6B7F99"
//             >
//               {new Date(item.row.timestamp).toLocaleDateString(undefined, {
//                 month: "short",
//                 day: "2-digit",
//                 hour: "2-digit",
//               })}
//             </text>
//           )}
//         </g>
//       ))}

//       <g transform="translate(610,15)">
//         <circle cx="0" cy="0" r="4" fill="#F59E0B" />
//         <text x="10" y="3" fontSize="9" fill="#6B7F99">
//           Incoming
//         </text>

//         <circle cx="90" cy="0" r="4" fill="#2563EB" />
//         <text x="100" y="3" fontSize="9" fill="#6B7F99">
//           Outgoing
//         </text>
//       </g>
//     </svg>
//   );
// };

// const EnergyBars = ({ rows }) => {
//   if (!rows.length) {
//     return null;
//   }

//   const grouped = rows.reduce((accumulator, row) => {
//     const key = row.timestamp.slice(0, 13);
//     accumulator[key] =
//       (accumulator[key] || 0) + Number(row.energyKwh || 0);
//     return accumulator;
//   }, {});

//   const points = Object.entries(grouped).slice(-12);
//   const maxValue = Math.max(...points.map(([, value]) => value), 1);

//   return (
//     <div className="flex h-[190px] items-end gap-2">
//       {points.map(([label, value]) => (
//         <div
//           key={label}
//           className="flex min-w-0 flex-1 flex-col items-center justify-end"
//         >
//           <div className="mb-2 text-[8px] font-semibold text-[#2563EB]">
//             {Math.round(value)}
//           </div>

//           <div
//             className="w-full max-w-[28px] rounded-t bg-[#2563EB]"
//             style={{
//               height: `${Math.max(10, (value / maxValue) * 125)}px`,
//             }}
//           />

//           <p className="mt-2 truncate text-[7px] text-[#6B7F99]">
//             {label.slice(11, 13)}h
//           </p>
//         </div>
//       ))}
//     </div>
//   );
// };

// const escapeCsv = (value) =>
//   `"${String(value ?? "").replace(/"/g, '""')}"`;

// const triggerDownload = (blob, filename) => {
//   const url = URL.createObjectURL(blob);
//   const link = document.createElement("a");

//   link.href = url;
//   link.download = filename;
//   document.body.appendChild(link);
//   link.click();
//   link.remove();
//   URL.revokeObjectURL(url);
// };

// export default function OverviewPage() {
//   const navigate = useNavigate();

//   const [selectedEquipment, setSelectedEquipment] =
//     useState("system");

//   const [selectedPeriod, setSelectedPeriod] =
//     useState("daily");

//   const [selectedDate, setSelectedDate] =
//     useState(formatDateKey(new Date()));

//   const [selectedMonth, setSelectedMonth] =
//     useState(getCurrentMonth());

//   const [fromTime, setFromTime] = useState("00:00");
//   const [toTime, setToTime] = useState("23:59");
//   const [customStart, setCustomStart] = useState("");
//   const [customEnd, setCustomEnd] = useState("");

//   const filteredData = useMemo(() => {
//     return ANALYTICS_DATA.filter((row) => {
//       if (row.equipment !== selectedEquipment) {
//         return false;
//       }

//       const timestamp = new Date(row.timestamp);
//       const rowDate = row.timestamp.slice(0, 10);
//       const rowMonth = row.timestamp.slice(0, 7);
//       const rowTime = row.timestamp.slice(11, 16);

//       if (selectedPeriod === "daily") {
//         return (
//           rowDate === selectedDate &&
//           rowTime >= fromTime &&
//           rowTime <= toTime
//         );
//       }

//       if (selectedPeriod === "weekly") {
//         const selected = new Date(`${selectedDate}T00:00:00`);
//         const weekStart = new Date(selected);
//         weekStart.setDate(selected.getDate() - selected.getDay());

//         const weekEnd = new Date(weekStart);
//         weekEnd.setDate(weekStart.getDate() + 7);

//         return timestamp >= weekStart && timestamp < weekEnd;
//       }

//       if (selectedPeriod === "monthly") {
//         return rowMonth === selectedMonth;
//       }

//       if (selectedPeriod === "custom") {
//         const start = customStart ? new Date(customStart) : null;
//         const end = customEnd ? new Date(customEnd) : null;

//         if (start && timestamp < start) {
//           return false;
//         }

//         if (end && timestamp > end) {
//           return false;
//         }

//         return true;
//       }

//       return true;
//     });
//   }, [
//     selectedEquipment,
//     selectedPeriod,
//     selectedDate,
//     selectedMonth,
//     fromTime,
//     toTime,
//     customStart,
//     customEnd,
//   ]);

//   const summary = useMemo(() => {
//     if (!filteredData.length) {
//       return {
//         totalEnergy: 0,
//         peakLoad: 0,
//         averageLoad: 0,
//         totalLoss: 0,
//         efficiency: 0,
//         averageVoltage: 0,
//         averageCurrent: 0,
//         averagePowerFactor: 0,
//       };
//     }

//     const totalEnergy = filteredData.reduce(
//       (sum, row) => sum + Number(row.energyKwh || 0),
//       0
//     );

//     const peakLoad = Math.max(
//       ...filteredData.map((row) => Number(row.incomingKw || 0))
//     );

//     const averageLoad =
//       filteredData.reduce(
//         (sum, row) => sum + Number(row.outgoingKw || 0),
//         0
//       ) / filteredData.length;

//     const totalIncoming = filteredData.reduce(
//       (sum, row) => sum + Number(row.incomingKw || 0),
//       0
//     );

//     const totalOutgoing = filteredData.reduce(
//       (sum, row) => sum + Number(row.outgoingKw || 0),
//       0
//     );

//     const averageVoltage =
//       filteredData.reduce(
//         (sum, row) => sum + Number(row.voltage || 0),
//         0
//       ) / filteredData.length;

//     const averageCurrent =
//       filteredData.reduce(
//         (sum, row) => sum + Number(row.current || 0),
//         0
//       ) / filteredData.length;

//     const averagePowerFactor =
//       filteredData.reduce(
//         (sum, row) => sum + Number(row.powerFactor || 0),
//         0
//       ) / filteredData.length;

//     return {
//       totalEnergy,
//       peakLoad,
//       averageLoad,
//       totalLoss: Math.max(0, totalIncoming - totalOutgoing),
//       efficiency:
//         totalIncoming > 0 ? (totalOutgoing / totalIncoming) * 100 : 0,
//       averageVoltage,
//       averageCurrent,
//       averagePowerFactor,
//     };
//   }, [filteredData]);

//   const selectedEquipmentLabel =
//     EQUIPMENT_OPTIONS.find(
//       (item) => item.key === selectedEquipment
//     )?.label || "Entire System";

//   const downloadCsv = () => {
//     if (!filteredData.length) return;

//     const headers = [
//       "Timestamp",
//       "Equipment",
//       "Incoming kW",
//       "Outgoing kW",
//       "Energy kWh",
//       "Voltage",
//       "Current",
//       "Power Factor",
//       "Status",
//     ];

//     const rows = filteredData.map((row) => [
//       row.timestamp,
//       row.equipmentLabel,
//       row.incomingKw,
//       row.outgoingKw,
//       row.energyKwh,
//       row.voltage,
//       row.current,
//       row.powerFactor,
//       row.status,
//     ]);

//     const csv = [headers, ...rows]
//       .map((row) => row.map(escapeCsv).join(","))
//       .join("\n");

//     triggerDownload(
//       new Blob([csv], {
//         type: "text/csv;charset=utf-8;",
//       }),
//       `power-analytics-${selectedEquipment}-${selectedPeriod}.csv`
//     );
//   };

//   const downloadJson = () => {
//     const report = {
//       generatedAt: new Date().toISOString(),
//       filters: {
//         equipment: selectedEquipment,
//         period: selectedPeriod,
//         selectedDate,
//         selectedMonth,
//         fromTime,
//         toTime,
//         customStart,
//         customEnd,
//       },
//       summary,
//       readings: filteredData,
//     };

//     triggerDownload(
//       new Blob([JSON.stringify(report, null, 2)], {
//         type: "application/json",
//       }),
//       `power-analytics-${selectedEquipment}-${selectedPeriod}.json`
//     );
//   };

//   const resetFilters = () => {
//     setSelectedEquipment("system");
//     setSelectedPeriod("daily");
//     setSelectedDate(formatDateKey(new Date()));
//     setSelectedMonth(getCurrentMonth());
//     setFromTime("00:00");
//     setToTime("23:59");
//     setCustomStart("");
//     setCustomEnd("");
//   };

//   return (
//     <div className="min-h-screen w-full bg-[#F4F8FC] text-[#081F5C]">
//       <header className="sticky top-0 z-50 flex h-[64px] items-center justify-between border-b border-[#D7E4F2] bg-white px-6 shadow-[0_4px_14px_rgba(8,31,92,0.05)]">
//         <div
//           onClick={() => navigate("/")}
//           className="flex cursor-pointer items-center"
//         >
//           <div>
//             <h1 className="text-[22px] font-semibold uppercase leading-none tracking-[0.18em] text-[#081F5C]">
//               ARCOT{" "}
//               <span className="text-[#2563EB]">
//                 IIOT 1.0
//               </span>
//             </h1>

//             <p className="mt-2 text-[8px] uppercase tracking-[0.35em] text-[#4271AB]">
//               Industrial Internet of Things
//             </p>
//           </div>

//           <div className="mx-4 h-[44px] border-l border-[#D7E4F2]" />

//           <img
//             src={prestigeLogo}
//             alt="Prestige"
//             className="h-[46px] w-[94px] object-contain"
//           />
//         </div>

//         <button
//           type="button"
//           onClick={() => navigate("/")}
//           className="rounded-lg border border-[#2563EB] px-5 py-2 text-[9px] font-bold uppercase tracking-[0.12em] text-[#2563EB]"
//         >
//           Dashboard
//         </button>
//       </header>

//       <main className="mx-auto w-full max-w-[1700px] p-4">
//         <Card className="p-4">
//           <SectionTitle
//             title="Power Analytics Filters"
//             subtitle="Select equipment and time period to inspect exact consumption and operating performance."
//             rightContent={
//               <div className="flex flex-wrap gap-2">
//                 <button
//                   type="button"
//                   onClick={downloadCsv}
//                   className="rounded-lg bg-[#2563EB] px-4 py-2 text-[8px] font-bold uppercase tracking-[0.1em] text-white"
//                 >
//                   Download CSV
//                 </button>

//                 <button
//                   type="button"
//                   onClick={downloadJson}
//                   className="rounded-lg border border-[#2563EB] px-4 py-2 text-[8px] font-bold uppercase tracking-[0.1em] text-[#2563EB]"
//                 >
//                   Download JSON
//                 </button>

//                 <button
//                   type="button"
//                   onClick={() => window.print()}
//                   className="rounded-lg border border-[#D7E4F2] px-4 py-2 text-[8px] font-bold uppercase tracking-[0.1em] text-[#5D718C]"
//                 >
//                   Print Report
//                 </button>
//               </div>
//             }
//           />

//           <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-7">
//             <select
//               value={selectedEquipment}
//               onChange={(event) =>
//                 setSelectedEquipment(event.target.value)
//               }
//               className="rounded-lg border border-[#D7E4F2] bg-white px-3 py-2.5 text-[10px] text-[#081F5C] outline-none"
//             >
//               {EQUIPMENT_OPTIONS.map((option) => (
//                 <option key={option.key} value={option.key}>
//                   {option.label}
//                 </option>
//               ))}
//             </select>

//             <select
//               value={selectedPeriod}
//               onChange={(event) =>
//                 setSelectedPeriod(event.target.value)
//               }
//               className="rounded-lg border border-[#D7E4F2] bg-white px-3 py-2.5 text-[10px] text-[#081F5C] outline-none"
//             >
//               <option value="daily">Daily</option>
//               <option value="weekly">Weekly</option>
//               <option value="monthly">Monthly</option>
//               <option value="custom">Custom Range</option>
//             </select>

//             {(selectedPeriod === "daily" ||
//               selectedPeriod === "weekly") && (
//               <input
//                 type="date"
//                 value={selectedDate}
//                 onChange={(event) =>
//                   setSelectedDate(event.target.value)
//                 }
//                 className="rounded-lg border border-[#D7E4F2] bg-white px-3 py-2.5 text-[10px] text-[#081F5C] outline-none"
//               />
//             )}

//             {selectedPeriod === "monthly" && (
//               <input
//                 type="month"
//                 value={selectedMonth}
//                 onChange={(event) =>
//                   setSelectedMonth(event.target.value)
//                 }
//                 className="rounded-lg border border-[#D7E4F2] bg-white px-3 py-2.5 text-[10px] text-[#081F5C] outline-none"
//               />
//             )}

//             {selectedPeriod === "daily" && (
//               <>
//                 <input
//                   type="time"
//                   value={fromTime}
//                   onChange={(event) =>
//                     setFromTime(event.target.value)
//                   }
//                   className="rounded-lg border border-[#D7E4F2] bg-white px-3 py-2.5 text-[10px] text-[#081F5C] outline-none"
//                 />

//                 <input
//                   type="time"
//                   value={toTime}
//                   onChange={(event) =>
//                     setToTime(event.target.value)
//                   }
//                   className="rounded-lg border border-[#D7E4F2] bg-white px-3 py-2.5 text-[10px] text-[#081F5C] outline-none"
//                 />
//               </>
//             )}

//             {selectedPeriod === "custom" && (
//               <>
//                 <input
//                   type="datetime-local"
//                   value={customStart}
//                   onChange={(event) =>
//                     setCustomStart(event.target.value)
//                   }
//                   className="rounded-lg border border-[#D7E4F2] bg-white px-3 py-2.5 text-[10px] text-[#081F5C] outline-none"
//                 />

//                 <input
//                   type="datetime-local"
//                   value={customEnd}
//                   onChange={(event) =>
//                     setCustomEnd(event.target.value)
//                   }
//                   className="rounded-lg border border-[#D7E4F2] bg-white px-3 py-2.5 text-[10px] text-[#081F5C] outline-none"
//                 />
//               </>
//             )}

//             <button
//               type="button"
//               onClick={resetFilters}
//               className="rounded-lg border border-[#D7E4F2] bg-[#F8FBFE] px-4 py-2.5 text-[8px] font-bold uppercase tracking-[0.1em] text-[#5D718C]"
//             >
//               Reset Filters
//             </button>
//           </div>
//         </Card>

//         <section className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
//           <MetricCard
//             label="Consumed Energy"
//             value={summary.totalEnergy.toLocaleString(undefined, {
//               maximumFractionDigits: 0,
//             })}
//             unit="kWh"
//             tone="blue"
//             helper="Total energy consumed in the selected time range"
//           />

//           <MetricCard
//             label="Peak Load"
//             value={summary.peakLoad.toLocaleString(undefined, {
//               maximumFractionDigits: 0,
//             })}
//             unit="kW"
//             tone="amber"
//             helper="Highest incoming load recorded"
//           />

//           <MetricCard
//             label="Average Load"
//             value={summary.averageLoad.toLocaleString(undefined, {
//               maximumFractionDigits: 0,
//             })}
//             unit="kW"
//             tone="cyan"
//             helper="Average delivered power during the period"
//           />

//           <MetricCard
//             label="Distribution Loss"
//             value={summary.totalLoss.toLocaleString(undefined, {
//               maximumFractionDigits: 0,
//             })}
//             unit="kW"
//             tone="red"
//             helper="Accumulated incoming-to-outgoing difference"
//           />

//           <MetricCard
//             label="Efficiency"
//             value={`${summary.efficiency.toFixed(1)}%`}
//             tone="green"
//             helper="Overall delivery efficiency for selected readings"
//           />
//         </section>

//         <section className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-12">
//           <Card className="p-4 xl:col-span-8">
//             <SectionTitle
//               title={`${selectedEquipmentLabel} Load Trend`}
//               subtitle="Incoming and outgoing power across the selected period."
//             />

//             <div className="rounded-[14px] border border-[#DCE8F3] bg-[#FBFDFF] p-2">
//               <TrendChart rows={filteredData} />
//             </div>
//           </Card>

//           <div className="space-y-4 xl:col-span-4">
//             <Card className="p-4">
//               <SectionTitle
//                 title="Electrical Quality"
//                 subtitle="Average electrical conditions for the selected data."
//               />

//               <div className="grid grid-cols-3 gap-3">
//                 <div className="rounded-xl border border-[#DCE8F3] bg-[#F8FBFE] p-3 text-center">
//                   <p className="text-[8px] uppercase tracking-[0.1em] text-[#8292A8]">
//                     Voltage
//                   </p>
//                   <h3 className="mt-2 text-[20px] font-semibold text-[#2563EB]">
//                     {summary.averageVoltage.toFixed(1)}
//                   </h3>
//                   <p className="mt-1 text-[8px] text-[#8292A8]">V</p>
//                 </div>

//                 <div className="rounded-xl border border-[#DCE8F3] bg-[#F8FBFE] p-3 text-center">
//                   <p className="text-[8px] uppercase tracking-[0.1em] text-[#8292A8]">
//                     Current
//                   </p>
//                   <h3 className="mt-2 text-[20px] font-semibold text-[#0891B2]">
//                     {summary.averageCurrent.toFixed(1)}
//                   </h3>
//                   <p className="mt-1 text-[8px] text-[#8292A8]">A</p>
//                 </div>

//                 <div className="rounded-xl border border-[#DCE8F3] bg-[#F8FBFE] p-3 text-center">
//                   <p className="text-[8px] uppercase tracking-[0.1em] text-[#8292A8]">
//                     PF
//                   </p>
//                   <h3 className="mt-2 text-[20px] font-semibold text-[#15805F]">
//                     {summary.averagePowerFactor.toFixed(2)}
//                   </h3>
//                   <p className="mt-1 text-[8px] text-[#8292A8]">
//                     Average
//                   </p>
//                 </div>
//               </div>
//             </Card>

//             <Card className="p-4">
//               <SectionTitle
//                 title="Hourly Consumption"
//                 subtitle="Recent energy consumption blocks."
//               />
//               <EnergyBars rows={filteredData} />
//             </Card>
//           </div>
//         </section>

//         <section className="mt-4">
//           <Card className="p-4">
//             <SectionTitle
//               title="Detailed Analytical Readings"
//               subtitle={`${filteredData.length.toLocaleString()} readings match the selected filters.`}
//             />

//             <div className="max-h-[420px] overflow-auto">
//               <table className="w-full min-w-[1050px] border-collapse">
//                 <thead className="sticky top-0 z-10 bg-white">
//                   <tr className="border-b border-[#DCE8F3]">
//                     {[
//                       "Timestamp",
//                       "Equipment",
//                       "Incoming",
//                       "Outgoing",
//                       "Energy",
//                       "Voltage",
//                       "Current",
//                       "Power Factor",
//                       "Loss",
//                       "Status",
//                     ].map((heading) => (
//                       <th
//                         key={heading}
//                         className="px-3 py-3 text-left text-[8px] font-bold uppercase tracking-[0.1em] text-[#8292A8]"
//                       >
//                         {heading}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {filteredData.map((row, index) => {
//                     const loss = Math.max(
//                       0,
//                       Number(row.incomingKw) -
//                         Number(row.outgoingKw)
//                     );

//                     return (
//                       <tr
//                         key={`${row.timestamp}-${row.equipment}-${index}`}
//                         className="border-b border-[#EDF2F7] last:border-b-0"
//                       >
//                         <td className="px-3 py-3 text-[9px] text-[#5D718C]">
//                           {new Date(row.timestamp).toLocaleString()}
//                         </td>

//                         <td className="px-3 py-3 text-[9px] font-semibold text-[#081F5C]">
//                           {row.equipmentLabel}
//                         </td>

//                         <td className="px-3 py-3 text-[9px] text-[#081F5C]">
//                           {row.incomingKw} kW
//                         </td>

//                         <td className="px-3 py-3 text-[9px] text-[#081F5C]">
//                           {row.outgoingKw} kW
//                         </td>

//                         <td className="px-3 py-3 text-[9px] text-[#081F5C]">
//                           {row.energyKwh} kWh
//                         </td>

//                         <td className="px-3 py-3 text-[9px] text-[#5D718C]">
//                           {row.voltage} V
//                         </td>

//                         <td className="px-3 py-3 text-[9px] text-[#5D718C]">
//                           {row.current} A
//                         </td>

//                         <td className="px-3 py-3 text-[9px] text-[#5D718C]">
//                           {row.powerFactor}
//                         </td>

//                         <td
//                           className={`px-3 py-3 text-[9px] font-semibold ${
//                             loss > row.incomingKw * 0.1
//                               ? "text-[#B42318]"
//                               : loss > row.incomingKw * 0.06
//                                 ? "text-[#B7791F]"
//                                 : "text-[#15805F]"
//                           }`}
//                         >
//                           {loss} kW
//                         </td>

//                         <td className="px-3 py-3">
//                           <span
//                             className={`inline-flex rounded-full border px-2.5 py-1 text-[7px] font-bold uppercase tracking-[0.08em] ${
//                               row.status === "Normal"
//                                 ? "border-[#BEE8D4] bg-[#E8F5EE] text-[#15805F]"
//                                 : "border-[#F4D3B2] bg-[#FFF5DD] text-[#B7791F]"
//                             }`}
//                           >
//                             {row.status}
//                           </span>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           </Card>
//         </section>
//       </main>
//     </div>
//   );
// }







// import React, { useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Activity,
//   ArrowDownToLine,
//   BarChart3,
//   CalendarDays,
//   ChevronDown,
//   Clock3,
//   Download,
//   FileJson,
//   Gauge,
//   Layers3,
//   Printer,
//   RefreshCw,
//   Search,
//   ShieldCheck,
//   TrendingUp,
//   Zap,
// } from "lucide-react";
// import prestigeLogo from "../assets/ser-removebg.png";

// const EQUIPMENT_OPTIONS = [
//   { key: "system", label: "Entire System" },
//   { key: "source", label: "33kV Source" },
//   { key: "feeder", label: "33kV Feeder" },
//   { key: "transformer", label: "Transformer" },
//   { key: "kiosk", label: "LT Kiosk" },
//   { key: "busbar", label: "LT Busbar" },
//   { key: "pcc", label: "PCC Main" },
//   { key: "wing-a", label: "Wing A" },
//   { key: "wing-b", label: "Wing B" },
//   { key: "chillers", label: "Chillers" },
// ];

// const EQUIPMENT_MULTIPLIERS = {
//   system: 1,
//   source: 0.98,
//   feeder: 0.94,
//   transformer: 0.89,
//   kiosk: 0.84,
//   busbar: 0.81,
//   pcc: 0.77,
//   "wing-a": 0.3,
//   "wing-b": 0.28,
//   chillers: 0.19,
// };

// const formatDateKey = (date) => {
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, "0");
//   const day = String(date.getDate()).padStart(2, "0");
//   return `${year}-${month}-${day}`;
// };

// const getCurrentMonth = () => {
//   const date = new Date();
//   return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
// };

// const generateAnalyticsData = () => {
//   const rows = [];
//   const today = new Date();

//   for (let dayOffset = 60; dayOffset >= 0; dayOffset -= 1) {
//     const date = new Date(today);
//     date.setDate(today.getDate() - dayOffset);
//     const dateKey = formatDateKey(date);

//     EQUIPMENT_OPTIONS.forEach((equipment, equipmentIndex) => {
//       const multiplier = EQUIPMENT_MULTIPLIERS[equipment.key];

//       for (let hour = 0; hour < 24; hour += 1) {
//         const daylightFactor =
//           hour >= 6 && hour <= 22
//             ? 0.72 + Math.sin(((hour - 6) / 16) * Math.PI) * 0.38
//             : 0.52;

//         const weekdayFactor =
//           date.getDay() === 0 || date.getDay() === 6 ? 0.88 : 1;

//         const baseIncoming = 1080 * multiplier * daylightFactor * weekdayFactor;

//         const dailyNoise =
//           ((dayOffset * 13 + hour * 7 + equipmentIndex * 11) % 35) - 17;

//         const incomingKw = Math.max(30, Math.round(baseIncoming + dailyNoise));

//         const lossRatio =
//           equipment.key === "system" ? 0.085 : 0.025 + equipmentIndex * 0.004;

//         const outgoingKw = Math.max(
//           20,
//           Math.round(incomingKw * (1 - lossRatio)),
//         );

//         const energyKwh = Number(((incomingKw + outgoingKw) / 2).toFixed(2));

//         const voltageBase =
//           equipment.key === "source" || equipment.key === "feeder"
//             ? 33000
//             : 433;

//         const voltageVariation =
//           equipment.key === "source" || equipment.key === "feeder"
//             ? ((hour + dayOffset) % 9) * 18 - 72
//             : ((hour + equipmentIndex) % 7) - 3;

//         const voltage = voltageBase + voltageVariation;
//         const current = Number(
//           (
//             (outgoingKw * 1000) /
//             (Math.sqrt(3) * voltage * (0.95 + (equipmentIndex % 3) * 0.01))
//           ).toFixed(2),
//         );

//         const powerFactor = Number(
//           (0.95 + ((hour + equipmentIndex) % 4) * 0.01).toFixed(2),
//         );

//         const timestamp = `${dateKey}T${String(hour).padStart(2, "0")}:00:00`;

//         rows.push({
//           timestamp,
//           equipment: equipment.key,
//           equipmentLabel: equipment.label,
//           incomingKw,
//           outgoingKw,
//           energyKwh,
//           voltage,
//           current,
//           powerFactor,
//           status: outgoingKw / incomingKw < 0.88 ? "Attention" : "Normal",
//         });
//       }
//     });
//   }

//   return rows;
// };

// const ANALYTICS_DATA = generateAnalyticsData();

// const Card = ({ children, className = "" }) => (
//   <div
//     className={`relative overflow-hidden rounded-[20px] border border-[#D5E3F0] bg-white shadow-[0_14px_36px_rgba(8,31,92,0.075)] ${className}`}
//   >
//     <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#17A8DB]/45 to-transparent" />
//     {children}
//   </div>
// );

// const SectionTitle = ({ title, subtitle, rightContent, icon: Icon }) => (
//   <div className="mb-2 flex flex-wrap items-start justify-between gap-3">
//     <div className="flex items-start gap-3">
//       {Icon && (
//         <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] border border-[#C9DCEF] bg-[linear-gradient(145deg,#F8FBFF,#E8F2FA)] text-[#1B73C9] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
//           <Icon size={18} strokeWidth={2} />
//         </div>
//       )}

//       <div>
//         <h2 className="text-[14px] font-semibold tracking-[-0.01em] text-[#06224F]">
//           {title}
//         </h2>

//         {subtitle && (
//           <p className="mt-1 max-w-3xl text-[9px] leading-relaxed text-[#687F99]">
//             {subtitle}
//           </p>
//         )}
//       </div>
//     </div>

//     {rightContent}
//   </div>
// );

// const MetricCard = ({
//   label,
//   value,
//   unit,
//   helper,
//   tone = "blue",
//   icon: Icon,
//   trend,
// }) => {
//   const toneMap = {
//     blue: {
//       text: "text-[#1B73C9]",
//       icon: "text-[#1B73C9]",
//       iconBg: "bg-[#EAF4FD]",
//       iconBorder: "border-[#D8E6FF]",
//       accent: "from-[#1B73C9] to-[#17A8DB]",
//     },
//     cyan: {
//       text: "text-[#0E86B7]",
//       icon: "text-[#0E86B7]",
//       iconBg: "bg-[#ECFEFF]",
//       iconBorder: "border-[#C7F1F5]",
//       accent: "from-[#17A8DB] to-[#5DD9FF]",
//     },
//     green: {
//       text: "text-[#15805F]",
//       icon: "text-[#15805F]",
//       iconBg: "bg-[#ECFDF5]",
//       iconBorder: "border-[#CBEFDB]",
//       accent: "from-[#16A34A] to-[#34D399]",
//     },
//     amber: {
//       text: "text-[#B7791F]",
//       icon: "text-[#B7791F]",
//       iconBg: "bg-[#FFF8E8]",
//       iconBorder: "border-[#F8E4B0]",
//       accent: "from-[#F59E0B] to-[#FBBF24]",
//     },
//     red: {
//       text: "text-[#B42318]",
//       icon: "text-[#B42318]",
//       iconBg: "bg-[#FFF1F2]",
//       iconBorder: "border-[#FFD5D9]",
//       accent: "from-[#DC2626] to-[#F87171]",
//     },
//   };

//   const activeTone = toneMap[tone] || toneMap.blue;

//   return (
//     <Card className="print-safe group h-full min-h-0 p-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#BDD2E8] hover:shadow-[0_18px_42px_rgba(8,31,92,0.12)]">
//       <div
//         className={`absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r ${activeTone.accent}`}
//       />

//       <div className="flex items-start justify-between gap-3">
//         <div>
//           <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#687F99]">
//             {label}
//           </p>

//           <div className="mt-3 flex items-end gap-2">
//             <h3
//               className={`text-[25px] font-semibold leading-none tracking-[-0.03em] ${activeTone.text}`}
//             >
//               {value}
//             </h3>

//             {unit && (
//               <span className="pb-1 text-[9px] font-semibold uppercase text-[#8192A7]">
//                 {unit}
//               </span>
//             )}
//           </div>
//         </div>

//         {Icon && (
//           <div
//             className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] border ${activeTone.iconBorder} ${activeTone.iconBg} ${activeTone.icon}`}
//           >
//             <Icon size={18} strokeWidth={2.1} />
//           </div>
//         )}
//       </div>

//       <div className="mt-2.5 flex items-end justify-between gap-3">
//         <p className="text-[9px] leading-relaxed text-[#8192A7]">{helper}</p>

//         {trend && (
//           <span className="shrink-0 rounded-full border border-[#CBEFDB] bg-[#ECFDF5] px-2 py-1 text-[7px] font-bold uppercase tracking-[0.08em] text-[#15805F]">
//             {trend}
//           </span>
//         )}
//       </div>
//     </Card>
//   );
// };

// const TrendChart = ({ rows }) => {
//   if (!rows.length) {
//     return (
//       <div className="flex h-[260px] items-center justify-center text-[11px] text-[#687F99]">
//         No analytics data found for the selected filters.
//       </div>
//     );
//   }

//   const width = 820;
//   const height = 230;
//   const left = 58;
//   const right = 790;
//   const top = 24;
//   const bottom = 180;
//   const chartWidth = right - left;
//   const chartHeight = bottom - top;

//   const maxValue = Math.max(
//     ...rows.flatMap((row) => [row.incomingKw, row.outgoingKw]),
//     1,
//   );

//   const step = Math.max(1, Math.ceil(rows.length / 24));
//   const chartRows = rows.filter(
//     (_, index) => index % step === 0 || index === rows.length - 1,
//   );

//   const coordinates = chartRows.map((row, index) => {
//     const x =
//       chartRows.length === 1
//         ? left
//         : left + (index / (chartRows.length - 1)) * chartWidth;

//     return {
//       x,
//       incomingY: bottom - (Number(row.incomingKw) / maxValue) * chartHeight,
//       outgoingY: bottom - (Number(row.outgoingKw) / maxValue) * chartHeight,
//       row,
//     };
//   });

//   const incomingPoints = coordinates
//     .map((item) => `${item.x},${item.incomingY}`)
//     .join(" ");

//   const outgoingPoints = coordinates
//     .map((item) => `${item.x},${item.outgoingY}`)
//     .join(" ");

//   const labelStep = Math.max(1, Math.ceil(coordinates.length / 7));

//   return (
//     <svg viewBox={`0 0 ${width} ${height}`} className="h-full min-h-0 w-full">
//       {[0, 1, 2, 3, 4].map((index) => {
//         const y = top + index * (chartHeight / 4);
//         const value = maxValue - index * (maxValue / 4);

//         return (
//           <React.Fragment key={index}>
//             <line
//               x1={left}
//               x2={right}
//               y1={y}
//               y2={y}
//               stroke="rgba(8,31,92,0.10)"
//               strokeDasharray="4 4"
//             />
//             <text
//               x={left - 8}
//               y={y + 3}
//               textAnchor="end"
//               fontSize="8"
//               fill="#8192A7"
//             >
//               {Math.round(value)}
//             </text>
//           </React.Fragment>
//         );
//       })}

//       <polyline
//         points={incomingPoints}
//         fill="none"
//         stroke="#17A8DB"
//         strokeWidth="3"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />

//       <polyline
//         points={outgoingPoints}
//         fill="none"
//         stroke="#06224F"
//         strokeWidth="3"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />

//       {coordinates.map((item, index) => (
//         <g key={`${item.row.timestamp}-${index}`}>
//           <circle cx={item.x} cy={item.incomingY} r="3" fill="#17A8DB" />
//           <circle cx={item.x} cy={item.outgoingY} r="3" fill="#06224F" />

//           <title>
//             {`${new Date(item.row.timestamp).toLocaleString()} | Incoming ${item.row.incomingKw} kW | Outgoing ${item.row.outgoingKw} kW`}
//           </title>

//           {(index % labelStep === 0 || index === coordinates.length - 1) && (
//             <text
//               x={item.x}
//               y="205"
//               textAnchor="middle"
//               fontSize="8"
//               fill="#687F99"
//             >
//               {new Date(item.row.timestamp).toLocaleDateString(undefined, {
//                 month: "short",
//                 day: "2-digit",
//                 hour: "2-digit",
//               })}
//             </text>
//           )}
//         </g>
//       ))}

//       <g transform="translate(610,15)">
//         <circle cx="0" cy="0" r="4" fill="#17A8DB" />
//         <text x="10" y="3" fontSize="9" fill="#687F99">
//           Incoming
//         </text>

//         <circle cx="90" cy="0" r="4" fill="#06224F" />
//         <text x="100" y="3" fontSize="9" fill="#687F99">
//           Outgoing
//         </text>
//       </g>
//     </svg>
//   );
// };

// const EnergyBars = ({ rows }) => {
//   if (!rows.length) {
//     return null;
//   }

//   const grouped = rows.reduce((accumulator, row) => {
//     const key = row.timestamp.slice(0, 13);
//     accumulator[key] = (accumulator[key] || 0) + Number(row.energyKwh || 0);
//     return accumulator;
//   }, {});

//   const points = Object.entries(grouped).slice(-12);
//   const maxValue = Math.max(...points.map(([, value]) => value), 1);

//   return (
//     <div className="flex h-full min-h-0 items-end gap-2 pb-1">
//       {points.map(([label, value]) => (
//         <div
//           key={label}
//           className="flex min-w-0 flex-1 flex-col items-center justify-end"
//         >
//           <div className="mb-2 text-[8px] font-semibold text-[#06224F]">
//             {Math.round(value)}
//           </div>

//           <div
//             className="w-full max-w-[30px] rounded-t-[8px] bg-[linear-gradient(180deg,#17A8DB_0%,#1B73C9_100%)] shadow-[0_8px_16px_rgba(37,99,235,0.16)]"
//             style={{
//               height: `${Math.max(10, (value / maxValue) * 70)}px`,
//             }}
//           />

//           <p className="mt-1.5 truncate text-[7px] text-[#687F99]">
//             {label.slice(11, 13)}h
//           </p>
//         </div>
//       ))}
//     </div>
//   );
// };

// const escapeCsv = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;

// const triggerDownload = (blob, filename) => {
//   const url = URL.createObjectURL(blob);
//   const link = document.createElement("a");

//   link.href = url;
//   link.download = filename;
//   document.body.appendChild(link);
//   link.click();
//   link.remove();
//   URL.revokeObjectURL(url);
// };

// export default function OverviewPage() {
//   const navigate = useNavigate();

//   const [selectedEquipment, setSelectedEquipment] = useState("system");

//   const [selectedPeriod, setSelectedPeriod] = useState("daily");

//   const [selectedDate, setSelectedDate] = useState(formatDateKey(new Date()));

//   const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());

//   const [fromTime, setFromTime] = useState("00:00");
//   const [toTime, setToTime] = useState("23:59");
//   const [customStart, setCustomStart] = useState("");
//   const [customEnd, setCustomEnd] = useState("");
//   const [activeWorkspace, setActiveWorkspace] = useState("analytics");

//   const filteredData = useMemo(() => {
//     return ANALYTICS_DATA.filter((row) => {
//       if (row.equipment !== selectedEquipment) {
//         return false;
//       }

//       const timestamp = new Date(row.timestamp);
//       const rowDate = row.timestamp.slice(0, 10);
//       const rowMonth = row.timestamp.slice(0, 7);
//       const rowTime = row.timestamp.slice(11, 16);

//       if (selectedPeriod === "daily") {
//         return (
//           rowDate === selectedDate && rowTime >= fromTime && rowTime <= toTime
//         );
//       }

//       if (selectedPeriod === "weekly") {
//         const selected = new Date(`${selectedDate}T00:00:00`);
//         const weekStart = new Date(selected);
//         weekStart.setDate(selected.getDate() - selected.getDay());

//         const weekEnd = new Date(weekStart);
//         weekEnd.setDate(weekStart.getDate() + 7);

//         return timestamp >= weekStart && timestamp < weekEnd;
//       }

//       if (selectedPeriod === "monthly") {
//         return rowMonth === selectedMonth;
//       }

//       if (selectedPeriod === "custom") {
//         const start = customStart ? new Date(customStart) : null;
//         const end = customEnd ? new Date(customEnd) : null;

//         if (start && timestamp < start) {
//           return false;
//         }

//         if (end && timestamp > end) {
//           return false;
//         }

//         return true;
//       }

//       return true;
//     });
//   }, [
//     selectedEquipment,
//     selectedPeriod,
//     selectedDate,
//     selectedMonth,
//     fromTime,
//     toTime,
//     customStart,
//     customEnd,
//   ]);

//   const summary = useMemo(() => {
//     if (!filteredData.length) {
//       return {
//         totalEnergy: 0,
//         peakLoad: 0,
//         averageLoad: 0,
//         totalLoss: 0,
//         efficiency: 0,
//         averageVoltage: 0,
//         averageCurrent: 0,
//         averagePowerFactor: 0,
//       };
//     }

//     const totalEnergy = filteredData.reduce(
//       (sum, row) => sum + Number(row.energyKwh || 0),
//       0,
//     );

//     const peakLoad = Math.max(
//       ...filteredData.map((row) => Number(row.incomingKw || 0)),
//     );

//     const averageLoad =
//       filteredData.reduce((sum, row) => sum + Number(row.outgoingKw || 0), 0) /
//       filteredData.length;

//     const totalIncoming = filteredData.reduce(
//       (sum, row) => sum + Number(row.incomingKw || 0),
//       0,
//     );

//     const totalOutgoing = filteredData.reduce(
//       (sum, row) => sum + Number(row.outgoingKw || 0),
//       0,
//     );

//     const averageVoltage =
//       filteredData.reduce((sum, row) => sum + Number(row.voltage || 0), 0) /
//       filteredData.length;

//     const averageCurrent =
//       filteredData.reduce((sum, row) => sum + Number(row.current || 0), 0) /
//       filteredData.length;

//     const averagePowerFactor =
//       filteredData.reduce((sum, row) => sum + Number(row.powerFactor || 0), 0) /
//       filteredData.length;

//     return {
//       totalEnergy,
//       peakLoad,
//       averageLoad,
//       totalLoss: Math.max(0, totalIncoming - totalOutgoing),
//       efficiency: totalIncoming > 0 ? (totalOutgoing / totalIncoming) * 100 : 0,
//       averageVoltage,
//       averageCurrent,
//       averagePowerFactor,
//     };
//   }, [filteredData]);

//   const selectedEquipmentLabel =
//     EQUIPMENT_OPTIONS.find((item) => item.key === selectedEquipment)?.label ||
//     "Entire System";

//   const downloadCsv = () => {
//     if (!filteredData.length) return;

//     const headers = [
//       "Timestamp",
//       "Equipment",
//       "Incoming kW",
//       "Outgoing kW",
//       "Energy kWh",
//       "Voltage",
//       "Current",
//       "Power Factor",
//       "Status",
//     ];

//     const rows = filteredData.map((row) => [
//       row.timestamp,
//       row.equipmentLabel,
//       row.incomingKw,
//       row.outgoingKw,
//       row.energyKwh,
//       row.voltage,
//       row.current,
//       row.powerFactor,
//       row.status,
//     ]);

//     const csv = [headers, ...rows]
//       .map((row) => row.map(escapeCsv).join(","))
//       .join("\n");

//     triggerDownload(
//       new Blob([csv], {
//         type: "text/csv;charset=utf-8;",
//       }),
//       `power-analytics-${selectedEquipment}-${selectedPeriod}.csv`,
//     );
//   };

//   const downloadJson = () => {
//     const report = {
//       generatedAt: new Date().toISOString(),
//       filters: {
//         equipment: selectedEquipment,
//         period: selectedPeriod,
//         selectedDate,
//         selectedMonth,
//         fromTime,
//         toTime,
//         customStart,
//         customEnd,
//       },
//       summary,
//       readings: filteredData,
//     };

//     triggerDownload(
//       new Blob([JSON.stringify(report, null, 2)], {
//         type: "application/json",
//       }),
//       `power-analytics-${selectedEquipment}-${selectedPeriod}.json`,
//     );
//   };

//   const resetFilters = () => {
//     setSelectedEquipment("system");
//     setSelectedPeriod("daily");
//     setSelectedDate(formatDateKey(new Date()));
//     setSelectedMonth(getCurrentMonth());
//     setFromTime("00:00");
//     setToTime("23:59");
//     setCustomStart("");
//     setCustomEnd("");
//   };

//   return (
//     <div className="flex h-[100dvh] w-full flex-col overflow-hidden bg-[radial-gradient(circle_at_50%_0%,rgba(0,174,239,0.07),transparent_28%),linear-gradient(180deg,#F7FAFD_0%,#EEF5FA_100%)] text-[#06224F]">
//       <header className="relative z-50 h-[60px] shrink-0 before:absolute before:inset-x-0 before:top-0 before:h-[3px] before:bg-[linear-gradient(90deg,#06224F_0%,#1B73C9_55%,#17A8DB_100%)] border-b border-[#D5E2EF] bg-white/95 shadow-[0_6px_20px_rgba(8,31,92,0.06)] backdrop-blur-xl">
//         <div className="mx-auto flex h-full w-full max-w-[1720px] items-center justify-between px-4 sm:px-5 lg:px-6">
//           <div
//             onClick={() => navigate("/")}
//             className="flex min-w-0 cursor-pointer items-center"
//           >
//             <div className="min-w-0">
//               <h1 className="truncate text-[clamp(18px,2vw,22px)] font-semibold uppercase leading-none tracking-[0.16em] text-[#06224F]">
//                 ARCOT <span className="text-[#1B73C9]">IIOT 1.0</span>
//               </h1>

//               <p className="mt-2 truncate text-[8px] font-medium uppercase tracking-[0.3em] text-[#487AAE]">
//                 Industrial Internet of Things
//               </p>
//             </div>

//             <div className="mx-4 hidden h-[42px] border-l border-[#D3E2EF] sm:block" />

//             <img
//               src={prestigeLogo}
//               alt="Prestige"
//               className="hidden h-[38px] w-[88px] object-contain sm:block"
//             />
//           </div>

//           <div className="flex items-center gap-3">
//             <div className="hidden items-center gap-2 rounded-full border border-[#CDEBD9] bg-[#F0FAF4] px-3 py-2 sm:flex">
//               <span className="h-2 w-2 rounded-full bg-[#16A34A] shadow-[0_0_0_4px_rgba(22,163,74,0.10)]" />
//               <span className="text-[8px] font-bold uppercase tracking-[0.1em] text-[#15805F]">
//                 Analytics Online
//               </span>
//             </div>

//             <button
//               type="button"
//               onClick={() => navigate("/")}
//               className="rounded-[10px] border border-[#1B73C9] bg-[#1B73C9] px-3.5 py-2 text-[8px] font-bold uppercase tracking-[0.1em] text-white shadow-[0_8px_18px_rgba(37,99,235,0.18)] transition hover:bg-[#155FA8]"
//             >
//               Dashboard
//             </button>
//           </div>
//         </div>
//       </header>

//       <style>{`
//         @media (min-width: 1024px) and (max-height: 820px) {
//           .overview-main-grid {
//             grid-template-rows: 150px 106px 42px minmax(0, 1fr);
//             gap: 10px;
//           }
//         }

//         @media print {
//           header,
//           button,
//           select,
//           input {
//             display: none !important;
//           }

//           body {
//             background: white !important;
//           }

//           main {
//             max-width: none !important;
//             padding: 0 !important;
//           }

//           .print-safe {
//             box-shadow: none !important;
//             break-inside: avoid;
//           }
//         }
//       `}</style>

//       <main className="overview-main-grid mx-auto grid h-[calc(100dvh-60px)] w-full max-w-[1720px] grid-rows-[168px_112px_44px_minmax(0,1fr)] gap-3 overflow-y-auto px-4 py-3 sm:px-5 lg:overflow-hidden lg:px-6">
//         <section className="grid h-full min-h-0 grid-cols-12 gap-3">
//           <div className="relative col-span-12 overflow-hidden rounded-[22px] border border-[#0A326B] bg-[linear-gradient(135deg,#041A3E_0%,#073066_56%,#0A5E91_100%)] px-5 py-4 text-white shadow-[0_18px_42px_rgba(8,31,92,0.22)] lg:col-span-4">
//             <div className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full border border-white/10 bg-white/[0.04]" />
//             <div className="pointer-events-none absolute -bottom-24 left-16 h-52 w-52 rounded-full bg-[#17A8DB]/15 blur-3xl" />

//             <div className="relative flex h-full flex-col justify-between">
//               <div className="flex items-start justify-between gap-4">
//                 <div>
//                   <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-3 py-1.5">
//                     <span className="h-1.5 w-1.5 rounded-full bg-[#48D6A0] shadow-[0_0_0_4px_rgba(72,225,168,0.12)]" />
//                     <span className="text-[8px] font-bold uppercase tracking-[0.16em] text-[#D5F2FC]">
//                       Live intelligence
//                     </span>
//                   </div>

//                   <h2 className="mt-3 text-[20px] font-semibold leading-tight tracking-[-0.03em]">
//                     Power Analytics
//                     <span className="block text-[#5DD9FF]">Command Centre</span>
//                   </h2>
//                   <p className="mt-2 max-w-md text-[9px] leading-[1.7] text-[#B7D2E8]">
//                     Monitor consumption, load transfer, electrical quality, and
//                     distribution performance from one operational view.
//                   </p>
//                 </div>

//                 <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] border border-white/15 bg-white/[0.08] text-[#5DD9FF] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
//                   <BarChart3 size={21} />
//                 </div>
//               </div>

//               <div className="grid grid-cols-3 gap-2 pt-3">
//                 <div className="rounded-[12px] border border-white/10 bg-white/[0.07] px-3 py-2 backdrop-blur-sm">
//                   <p className="text-[7px] font-bold uppercase tracking-[0.12em] text-[#88B5D7]">
//                     Asset
//                   </p>
//                   <p className="mt-1 truncate text-[10px] font-semibold text-white">
//                     {selectedEquipmentLabel}
//                   </p>
//                 </div>
//                 <div className="rounded-[12px] border border-white/10 bg-white/[0.07] px-3 py-2 backdrop-blur-sm">
//                   <p className="text-[7px] font-bold uppercase tracking-[0.12em] text-[#88B5D7]">
//                     Period
//                   </p>
//                   <p className="mt-1 capitalize text-[10px] font-semibold text-white">
//                     {selectedPeriod}
//                   </p>
//                 </div>
//                 <div className="rounded-[12px] border border-white/10 bg-white/[0.07] px-3 py-2 backdrop-blur-sm">
//                   <p className="text-[7px] font-bold uppercase tracking-[0.12em] text-[#88B5D7]">
//                     Records
//                   </p>
//                   <p className="mt-1 text-[10px] font-semibold text-white">
//                     {filteredData.length.toLocaleString()}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <Card className="print-safe col-span-12 flex h-full min-h-0 flex-col p-3.5 lg:col-span-8">
//             <div className="flex items-center justify-between gap-3 border-b border-[#E3ECF5] pb-2.5">
//               <div className="flex items-center gap-3">
//                 <div className="flex h-9 w-9 items-center justify-center rounded-[11px] border border-[#D6E4F2] bg-[#EDF5FA] text-[#1B73C9]">
//                   <Gauge size={17} />
//                 </div>
//                 <div>
//                   <h3 className="text-[13px] font-semibold text-[#06224F]">
//                     Analysis Controls
//                   </h3>
//                   <p className="mt-0.5 text-[8px] text-[#7D91A7]">
//                     Select the asset and reporting window.
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-center gap-1.5">
//                 <button
//                   type="button"
//                   onClick={downloadCsv}
//                   className="inline-flex items-center gap-1.5 rounded-[9px] bg-[#1B73C9] px-3 py-2 text-[7px] font-bold uppercase tracking-[0.1em] text-white shadow-[0_7px_16px_rgba(37,99,235,0.18)] transition hover:bg-[#155FA8]"
//                 >
//                   <Download size={12} /> CSV
//                 </button>
//                 <button
//                   type="button"
//                   onClick={downloadJson}
//                   className="inline-flex items-center gap-1.5 rounded-[9px] border border-[#CCDCEB] bg-white px-3 py-2 text-[7px] font-bold uppercase tracking-[0.1em] text-[#416483] transition hover:border-[#1B73C9] hover:text-[#1B73C9]"
//                 >
//                   <FileJson size={12} /> JSON
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => window.print()}
//                   className="hidden h-8 w-8 items-center justify-center rounded-[9px] border border-[#CCDCEB] bg-white text-[#657B92] transition hover:border-[#06224F] hover:text-[#06224F] sm:flex"
//                 >
//                   <Printer size={13} />
//                 </button>
//               </div>
//             </div>

//             <div className="mt-3 grid min-h-0 flex-1 grid-cols-2 gap-2 md:grid-cols-4 xl:grid-cols-6">
//               <label className="flex min-w-0 flex-col gap-1">
//                 <span className="text-[7px] font-bold uppercase tracking-[0.12em] text-[#8192A7]">
//                   Equipment
//                 </span>
//                 <select
//                   value={selectedEquipment}
//                   onChange={(event) => setSelectedEquipment(event.target.value)}
//                   className="h-9 min-w-0 rounded-[9px] border border-[#C6D8E9] bg-[#FAFCFE] px-2.5 text-[9px] font-semibold text-[#06224F] outline-none transition focus:border-[#1B73C9] focus:ring-2 focus:ring-[#1B73C9]/10"
//                 >
//                   {EQUIPMENT_OPTIONS.map((option) => (
//                     <option key={option.key} value={option.key}>
//                       {option.label}
//                     </option>
//                   ))}
//                 </select>
//               </label>

//               <label className="flex min-w-0 flex-col gap-1">
//                 <span className="text-[7px] font-bold uppercase tracking-[0.12em] text-[#8192A7]">
//                   Period
//                 </span>
//                 <select
//                   value={selectedPeriod}
//                   onChange={(event) => setSelectedPeriod(event.target.value)}
//                   className="h-9 min-w-0 rounded-[9px] border border-[#C6D8E9] bg-[#FAFCFE] px-2.5 text-[9px] font-semibold text-[#06224F] outline-none transition focus:border-[#1B73C9] focus:ring-2 focus:ring-[#1B73C9]/10"
//                 >
//                   <option value="daily">Daily</option>
//                   <option value="weekly">Weekly</option>
//                   <option value="monthly">Monthly</option>
//                   <option value="custom">Custom Range</option>
//                 </select>
//               </label>

//               {(selectedPeriod === "daily" || selectedPeriod === "weekly") && (
//                 <label className="flex min-w-0 flex-col gap-1">
//                   <span className="text-[7px] font-bold uppercase tracking-[0.12em] text-[#8192A7]">
//                     Date
//                   </span>
//                   <input
//                     type="date"
//                     value={selectedDate}
//                     onChange={(event) => setSelectedDate(event.target.value)}
//                     className="h-9 min-w-0 rounded-[9px] border border-[#C6D8E9] bg-[#FAFCFE] px-2.5 text-[9px] font-semibold text-[#06224F] outline-none focus:border-[#1B73C9]"
//                   />
//                 </label>
//               )}
//               {selectedPeriod === "monthly" && (
//                 <label className="flex min-w-0 flex-col gap-1">
//                   <span className="text-[7px] font-bold uppercase tracking-[0.12em] text-[#8192A7]">
//                     Month
//                   </span>
//                   <input
//                     type="month"
//                     value={selectedMonth}
//                     onChange={(event) => setSelectedMonth(event.target.value)}
//                     className="h-9 min-w-0 rounded-[9px] border border-[#C6D8E9] bg-[#FAFCFE] px-2.5 text-[9px] font-semibold text-[#06224F] outline-none focus:border-[#1B73C9]"
//                   />
//                 </label>
//               )}
//               {selectedPeriod === "daily" && (
//                 <>
//                   <label className="flex min-w-0 flex-col gap-1">
//                     <span className="text-[7px] font-bold uppercase tracking-[0.12em] text-[#8192A7]">
//                       From
//                     </span>
//                     <input
//                       type="time"
//                       value={fromTime}
//                       onChange={(event) => setFromTime(event.target.value)}
//                       className="h-9 min-w-0 rounded-[9px] border border-[#C6D8E9] bg-[#FAFCFE] px-2.5 text-[9px] font-semibold text-[#06224F] outline-none focus:border-[#1B73C9]"
//                     />
//                   </label>
//                   <label className="flex min-w-0 flex-col gap-1">
//                     <span className="text-[7px] font-bold uppercase tracking-[0.12em] text-[#8192A7]">
//                       To
//                     </span>
//                     <input
//                       type="time"
//                       value={toTime}
//                       onChange={(event) => setToTime(event.target.value)}
//                       className="h-9 min-w-0 rounded-[9px] border border-[#C6D8E9] bg-[#FAFCFE] px-2.5 text-[9px] font-semibold text-[#06224F] outline-none focus:border-[#1B73C9]"
//                     />
//                   </label>
//                 </>
//               )}
//               {selectedPeriod === "custom" && (
//                 <>
//                   <label className="flex min-w-0 flex-col gap-1 md:col-span-2">
//                     <span className="text-[7px] font-bold uppercase tracking-[0.12em] text-[#8192A7]">
//                       Range start
//                     </span>
//                     <input
//                       type="datetime-local"
//                       value={customStart}
//                       onChange={(event) => setCustomStart(event.target.value)}
//                       className="h-9 min-w-0 rounded-[9px] border border-[#C6D8E9] bg-[#FAFCFE] px-2.5 text-[9px] font-semibold text-[#06224F] outline-none focus:border-[#1B73C9]"
//                     />
//                   </label>
//                   <label className="flex min-w-0 flex-col gap-1 md:col-span-2">
//                     <span className="text-[7px] font-bold uppercase tracking-[0.12em] text-[#8192A7]">
//                       Range end
//                     </span>
//                     <input
//                       type="datetime-local"
//                       value={customEnd}
//                       onChange={(event) => setCustomEnd(event.target.value)}
//                       className="h-9 min-w-0 rounded-[9px] border border-[#C6D8E9] bg-[#FAFCFE] px-2.5 text-[9px] font-semibold text-[#06224F] outline-none focus:border-[#1B73C9]"
//                     />
//                   </label>
//                 </>
//               )}

//               <button
//                 type="button"
//                 onClick={resetFilters}
//                 className="mt-auto inline-flex h-9 items-center justify-center gap-1.5 rounded-[9px] border border-[#C6D8E9] bg-[#F7FAFD] px-3 text-[7px] font-bold uppercase tracking-[0.1em] text-[#657B92] transition hover:border-[#1B73C9] hover:bg-white hover:text-[#1B73C9]"
//               >
//                 <RefreshCw size={12} /> Reset
//               </button>
//             </div>
//           </Card>
//         </section>

//         <section className="grid h-full grid-cols-2 gap-3 lg:grid-cols-5">
//           <MetricCard
//             label="Consumed Energy"
//             value={summary.totalEnergy.toLocaleString(undefined, {
//               maximumFractionDigits: 0,
//             })}
//             unit="kWh"
//             tone="blue"
//             helper="Total energy consumed in the selected time range"
//             icon={Zap}
//             trend="Live"
//           />

//           <MetricCard
//             label="Peak Load"
//             value={summary.peakLoad.toLocaleString(undefined, {
//               maximumFractionDigits: 0,
//             })}
//             unit="kW"
//             tone="amber"
//             helper="Highest incoming load recorded"
//             icon={TrendingUp}
//           />

//           <MetricCard
//             label="Average Load"
//             value={summary.averageLoad.toLocaleString(undefined, {
//               maximumFractionDigits: 0,
//             })}
//             unit="kW"
//             tone="cyan"
//             helper="Average delivered power during the period"
//             icon={Activity}
//           />

//           <MetricCard
//             label="Distribution Loss"
//             value={summary.totalLoss.toLocaleString(undefined, {
//               maximumFractionDigits: 0,
//             })}
//             unit="kW"
//             tone="red"
//             helper="Accumulated incoming-to-outgoing difference"
//             icon={ArrowDownToLine}
//           />

//           <MetricCard
//             label="Efficiency"
//             value={`${summary.efficiency.toFixed(1)}%`}
//             tone="green"
//             helper="Overall delivery efficiency for selected readings"
//             icon={ShieldCheck}
//           />
//         </section>

//         <div className="flex h-full items-center justify-between rounded-[14px] border border-[#D3E2EF] bg-white px-1.5 shadow-[0_8px_22px_rgba(8,31,92,0.06)]">
//           <div className="flex items-center gap-1">
//             <button
//               type="button"
//               onClick={() => setActiveWorkspace("analytics")}
//               className={`inline-flex items-center gap-2 rounded-[9px] px-4 py-2 text-[8px] font-bold uppercase tracking-[0.1em] transition ${
//                 activeWorkspace === "analytics"
//                   ? "bg-[#06224F] text-white shadow-[0_8px_18px_rgba(8,31,92,0.18)]"
//                   : "text-[#687F99] hover:bg-[#EDF5FA] hover:text-[#06224F]"
//               }`}
//             >
//               <BarChart3 size={13} />
//               Analytics
//             </button>

//             <button
//               type="button"
//               onClick={() => setActiveWorkspace("readings")}
//               className={`inline-flex items-center gap-2 rounded-[9px] px-4 py-2 text-[8px] font-bold uppercase tracking-[0.1em] transition ${
//                 activeWorkspace === "readings"
//                   ? "bg-[#06224F] text-white shadow-[0_8px_18px_rgba(8,31,92,0.18)]"
//                   : "text-[#687F99] hover:bg-[#EDF5FA] hover:text-[#06224F]"
//               }`}
//             >
//               <Layers3 size={13} />
//               Detailed Readings
//             </button>
//           </div>

//           <div className="hidden items-center gap-2 pr-2 md:flex">
//             <span className="h-2 w-2 rounded-full bg-[#16A34A] shadow-[0_0_0_4px_rgba(22,163,74,0.10)]" />
//             <span className="text-[8px] font-bold uppercase tracking-[0.1em] text-[#15805F]">
//               {filteredData.length.toLocaleString()} records loaded
//             </span>
//           </div>
//         </div>

//         {activeWorkspace === "analytics" ? (
//           <section className="grid h-full min-h-0 grid-cols-12 gap-3 overflow-hidden">
//             <Card className="print-safe col-span-12 flex h-full min-h-0 flex-col p-4 xl:col-span-8">
//               <SectionTitle
//                 title={`${selectedEquipmentLabel} Load Trend`}
//                 subtitle="Incoming and outgoing power across the selected period."
//                 icon={TrendingUp}
//               />

//               <div className="flex min-h-0 flex-1 items-stretch rounded-[16px] border border-[#D8E6F2] bg-[linear-gradient(180deg,#FAFCFE_0%,#F6FAFE_100%)] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
//                 <TrendChart rows={filteredData} />
//               </div>
//             </Card>

//             <div className="col-span-12 grid h-full min-h-0 grid-cols-2 gap-3 xl:col-span-4 xl:grid-cols-1 xl:grid-rows-[0.82fr_1.18fr]">
//               <Card className="print-safe flex h-full min-h-0 flex-col p-3.5">
//                 <SectionTitle
//                   title="Electrical Quality"
//                   subtitle="Average electrical conditions for the selected data."
//                   icon={Gauge}
//                 />

//                 <div className="grid min-h-0 flex-1 grid-cols-3 items-stretch gap-2">
//                   <div className="flex min-h-0 flex-col items-center justify-center rounded-[14px] border border-[#D8E6F2] bg-[linear-gradient(180deg,#FFFFFF_0%,#F5F9FC_100%)] p-2 text-center shadow-[0_8px_18px_rgba(8,31,92,0.05)]">
//                     <p className="text-[8px] uppercase tracking-[0.1em] text-[#8192A7]">
//                       Voltage
//                     </p>
//                     <h3 className="mt-2 text-[18px] font-semibold text-[#1B73C9]">
//                       {summary.averageVoltage.toFixed(1)}
//                     </h3>
//                     <p className="mt-1 text-[8px] text-[#8192A7]">V</p>
//                   </div>

//                   <div className="flex min-h-0 flex-col items-center justify-center rounded-[14px] border border-[#D8E6F2] bg-[linear-gradient(180deg,#FFFFFF_0%,#F5F9FC_100%)] p-2 text-center shadow-[0_8px_18px_rgba(8,31,92,0.05)]">
//                     <p className="text-[8px] uppercase tracking-[0.1em] text-[#8192A7]">
//                       Current
//                     </p>
//                     <h3 className="mt-2 text-[18px] font-semibold text-[#0E86B7]">
//                       {summary.averageCurrent.toFixed(1)}
//                     </h3>
//                     <p className="mt-1 text-[8px] text-[#8192A7]">A</p>
//                   </div>

//                   <div className="flex min-h-0 flex-col items-center justify-center rounded-[14px] border border-[#D8E6F2] bg-[linear-gradient(180deg,#FFFFFF_0%,#F5F9FC_100%)] p-2 text-center shadow-[0_8px_18px_rgba(8,31,92,0.05)]">
//                     <p className="text-[8px] uppercase tracking-[0.1em] text-[#8192A7]">
//                       PF
//                     </p>
//                     <h3 className="mt-2 text-[18px] font-semibold text-[#15805F]">
//                       {summary.averagePowerFactor.toFixed(2)}
//                     </h3>
//                     <p className="mt-1 text-[8px] text-[#8192A7]">Average</p>
//                   </div>
//                 </div>
//               </Card>

//               <Card className="print-safe flex h-full min-h-0 flex-col p-3.5">
//                 <SectionTitle
//                   title="Hourly Consumption"
//                   subtitle="Recent energy consumption blocks."
//                   icon={BarChart3}
//                 />
//                 <div className="min-h-0 flex-1 overflow-hidden px-1 pt-1">
//                   <EnergyBars rows={filteredData} />
//                 </div>
//               </Card>
//             </div>
//           </section>
//         ) : (
//           <section className="h-full min-h-0">
//             <Card className="print-safe flex h-full min-h-0 flex-col p-3.5">
//               <SectionTitle
//                 title="Detailed Analytical Readings"
//                 subtitle={`${filteredData.length.toLocaleString()} readings match the selected filters.`}
//                 icon={Layers3}
//               />

//               <div className="min-h-0 flex-1 overflow-auto rounded-[12px] border border-[#E2EBF4]">
//                 <table className="w-full min-w-[1050px] border-collapse">
//                   <thead className="sticky top-0 z-10 bg-[#F5F9FC]/95 backdrop-blur">
//                     <tr className="border-b border-[#D8E6F2]">
//                       {[
//                         "Timestamp",
//                         "Equipment",
//                         "Incoming",
//                         "Outgoing",
//                         "Energy",
//                         "Voltage",
//                         "Current",
//                         "Power Factor",
//                         "Loss",
//                         "Status",
//                       ].map((heading) => (
//                         <th
//                           key={heading}
//                           className="px-3 py-2.5 text-left text-[8px] font-bold uppercase tracking-[0.1em] text-[#8192A7]"
//                         >
//                           {heading}
//                         </th>
//                       ))}
//                     </tr>
//                   </thead>

//                   <tbody>
//                     {filteredData.map((row, index) => {
//                       const loss = Math.max(
//                         0,
//                         Number(row.incomingKw) - Number(row.outgoingKw),
//                       );

//                       return (
//                         <tr
//                           key={`${row.timestamp}-${row.equipment}-${index}`}
//                           className="border-b border-[#EDF2F7] transition hover:bg-[#F5F9FC] last:border-b-0"
//                         >
//                           <td className="px-3 py-2.5 text-[9px] text-[#5F738D]">
//                             {new Date(row.timestamp).toLocaleString()}
//                           </td>

//                           <td className="px-3 py-2.5 text-[9px] font-semibold text-[#06224F]">
//                             {row.equipmentLabel}
//                           </td>

//                           <td className="px-3 py-2.5 text-[9px] text-[#06224F]">
//                             {row.incomingKw} kW
//                           </td>

//                           <td className="px-3 py-2.5 text-[9px] text-[#06224F]">
//                             {row.outgoingKw} kW
//                           </td>

//                           <td className="px-3 py-2.5 text-[9px] text-[#06224F]">
//                             {row.energyKwh} kWh
//                           </td>

//                           <td className="px-3 py-2.5 text-[9px] text-[#5F738D]">
//                             {row.voltage} V
//                           </td>

//                           <td className="px-3 py-2.5 text-[9px] text-[#5F738D]">
//                             {row.current} A
//                           </td>

//                           <td className="px-3 py-2.5 text-[9px] text-[#5F738D]">
//                             {row.powerFactor}
//                           </td>

//                           <td
//                             className={`px-3 py-3 text-[9px] font-semibold ${
//                               loss > row.incomingKw * 0.1
//                                 ? "text-[#B42318]"
//                                 : loss > row.incomingKw * 0.06
//                                   ? "text-[#B7791F]"
//                                   : "text-[#15805F]"
//                             }`}
//                           >
//                             {loss} kW
//                           </td>

//                           <td className="px-3 py-3">
//                             <span
//                               className={`inline-flex rounded-full border px-2.5 py-1 text-[7px] font-bold uppercase tracking-[0.08em] ${
//                                 row.status === "Normal"
//                                   ? "border-[#BEE8D4] bg-[#E8F5EE] text-[#15805F]"
//                                   : "border-[#F4D3B2] bg-[#FFF5DD] text-[#B7791F]"
//                               }`}
//                             >
//                               {row.status}
//                             </span>
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>
//             </Card>
//           </section>
//         )}
//       </main>
//     </div>
//   );
// }

























// import React, { useMemo, useState } from "react";
// import * as XLSX from "xlsx";
// import { Link } from "react-router-dom";
// import {
//   Activity,
//   ArrowDownToLine,
//   BarChart3,
//   CalendarDays,
//   ChevronDown,
//   Clock3,
//   Download,
//   FileJson,
//   Gauge,
//   Layers3,
//   Printer,
//   RefreshCw,
//   Search,
//   ShieldCheck,
//   TrendingUp,
//   Zap,
// } from "lucide-react";
// import prestigeLogo from "../assets/ser-removebg.png";
// import { tempApi } from "../tempAdminApi";
// import { SYSTEM_ROLES, USER_PERMISSIONS } from "../data/permissionOptions";
// import { buildings } from "../data/bmsData";
// import {
//   filterReadingsForAccount,
//   hasPermission as accountHasPermission,
//   isSuperAdmin,
// } from "../utils/accessControl";
// import { getAllZones, normalizeId } from "../utils/bmsHierarchy";

// const EQUIPMENT_OPTIONS = [
//   // 33kV SOURCE
//   { key: "source", label: "33kV Source", group: "33kV Source", multiplier: 0.98, voltageBase: 33000 },
//   { key: "source-inc1", label: "INC1 Incoming Feeder", group: "33kV Source", multiplier: 0.96, voltageBase: 33000 },
//   { key: "source-out", label: "OUT Outgoing Busbar", group: "33kV Source", multiplier: 0.94, voltageBase: 33000 },
//   { key: "source-inc2", label: "INC2 Incoming Feeder", group: "33kV Source", multiplier: 0.92, voltageBase: 33000 },
//   { key: "source-meter", label: "Metering Unit", group: "33kV Source", multiplier: 0.90, voltageBase: 33000 },

//   // 33kV FEEDER
//   { key: "feeder", label: "33kV Feeder Panel", group: "33kV Feeder", multiplier: 0.94, voltageBase: 33000 },
//   { key: "feeder-in-1", label: "Incoming Feeder 1", group: "33kV Feeder", multiplier: 0.93, voltageBase: 33000 },
//   ...Array.from({ length: 6 }, (_, index) => ({
//     key: `feeder-og-${index + 1}`,
//     label: `OG ${index + 1}`,
//     group: "33kV Feeder",
//     multiplier: 0.91 - index * 0.018,
//     voltageBase: 33000,
//   })),

//   // TRANSFORMERS — 6
//   { key: "transformer", label: "Transformers", group: "Transformer", multiplier: 0.89, voltageBase: 433 },
//   ...Array.from({ length: 6 }, (_, index) => ({
//     key: `transformer-${index + 1}`,
//     label: `TR-${index + 1}`,
//     group: "Transformer",
//     multiplier: 0.87 - index * 0.025,
//     voltageBase: 433,
//   })),

//   // LT KIOSK — 6
//   { key: "kiosk", label: "LT Kiosk", group: "LT Kiosk", multiplier: 0.84, voltageBase: 433 },
//   ...Array.from({ length: 6 }, (_, index) => ({
//     key: `kiosk-${index + 1}`,
//     label: `KIOSK-${index + 1}`,
//     group: "LT Kiosk",
//     multiplier: 0.82 - index * 0.022,
//     voltageBase: 433,
//   })),

//   // LT BUSDUCT / BUSBAR — 6
//   { key: "busbar", label: "LT Busduct / Busbar", group: "Busduct", multiplier: 0.81, voltageBase: 433 },
//   ...Array.from({ length: 6 }, (_, index) => ({
//     key: `bus-${index + 1}`,
//     label: `BUS-${index + 1}`,
//     group: "Busduct",
//     multiplier: 0.79 - index * 0.022,
//     voltageBase: 433,
//   })),

//   // PCC MAIN
//   { key: "pcc", label: "PCC Main", group: "PCC", multiplier: 0.77, voltageBase: 433 },
//   { key: "pcc-1", label: "PCC 1", group: "PCC", multiplier: 0.75, voltageBase: 433 },
//   { key: "pcc-2", label: "PCC 2", group: "PCC", multiplier: 0.73, voltageBase: 433 },
//   { key: "pcc-3", label: "PCC 3", group: "PCC", multiplier: 0.71, voltageBase: 433 },
//   { key: "pcc-4", label: "PCC 4", group: "PCC", multiplier: 0.69, voltageBase: 433 },

//   // PCC 1 INNER PANELS
//   { key: "pcc1-lt6-in", label: "PCC 1 · LT6 IN", group: "PCC 1 Inner", multiplier: 0.45, voltageBase: 433 },
//   { key: "pcc1-dg1234-in-1", label: "PCC 1 · DG1234 IN", group: "PCC 1 Inner", multiplier: 0.43, voltageBase: 433 },
//   { key: "pcc1-og1", label: "PCC 1 · OG 1", group: "PCC 1 Inner", multiplier: 0.39, voltageBase: 433 },
//   { key: "pcc1-rm1-a", label: "PCC 1 · RM1 A", group: "PCC 1 Inner", multiplier: 0.36, voltageBase: 433 },
//   { key: "pcc1-rm2-a", label: "PCC 1 · RM2 A", group: "PCC 1 Inner", multiplier: 0.34, voltageBase: 433 },
//   { key: "pcc1-utility1", label: "PCC 1 · Utility 1", group: "PCC 1 Inner", multiplier: 0.31, voltageBase: 433 },
//   { key: "pcc1-spare1", label: "PCC 1 · Spare 1", group: "PCC 1 Inner", multiplier: 0.08, voltageBase: 433 },
//   { key: "pcc1-bus-coupler", label: "PCC 1 · Bus Coupler B/C", group: "PCC 1 Inner", multiplier: 0.28, voltageBase: 433 },
//   { key: "pcc1-lt5-in", label: "PCC 1 · LT5 IN", group: "PCC 1 Inner", multiplier: 0.44, voltageBase: 433 },
//   { key: "pcc1-dg1234-in-2", label: "PCC 1 · DG 1234 IN", group: "PCC 1 Inner", multiplier: 0.42, voltageBase: 433 },
//   { key: "pcc1-rm1-b", label: "PCC 1 · RM1 B", group: "PCC 1 Inner", multiplier: 0.35, voltageBase: 433 },
//   { key: "pcc1-rm2-b", label: "PCC 1 · RM2 B", group: "PCC 1 Inner", multiplier: 0.33, voltageBase: 433 },
//   { key: "pcc1-utility2", label: "PCC 1 · Utility 2", group: "PCC 1 Inner", multiplier: 0.30, voltageBase: 433 },
//   { key: "pcc1-spare2", label: "PCC 1 · Spare 2", group: "PCC 1 Inner", multiplier: 0.08, voltageBase: 433 },

//   // PCC 2 INNER PANELS
//   { key: "pcc2-lt1-in", label: "PCC 2 · LT1 IN", group: "PCC 2 Inner", multiplier: 0.45, voltageBase: 433 },
//   { key: "pcc2-dg1234-in-1", label: "PCC 2 · DG1234 IN", group: "PCC 2 Inner", multiplier: 0.43, voltageBase: 433 },
//   { key: "pcc2-og1", label: "PCC 2 · OG 1", group: "PCC 2 Inner", multiplier: 0.39, voltageBase: 433 },
//   { key: "pcc2-rm1-a", label: "PCC 2 · RM1 A", group: "PCC 2 Inner", multiplier: 0.36, voltageBase: 433 },
//   { key: "pcc2-rm2-a", label: "PCC 2 · RM2 A", group: "PCC 2 Inner", multiplier: 0.34, voltageBase: 433 },
//   { key: "pcc2-utility1", label: "PCC 2 · Utility 1", group: "PCC 2 Inner", multiplier: 0.31, voltageBase: 433 },
//   { key: "pcc2-spare1", label: "PCC 2 · Spare 1", group: "PCC 2 Inner", multiplier: 0.08, voltageBase: 433 },
//   { key: "pcc2-bus-coupler", label: "PCC 2 · Bus Coupler B/C", group: "PCC 2 Inner", multiplier: 0.28, voltageBase: 433 },
//   { key: "pcc2-lt2-in", label: "PCC 2 · LT2 IN", group: "PCC 2 Inner", multiplier: 0.44, voltageBase: 433 },
//   { key: "pcc2-dg1234-in-2", label: "PCC 2 · DG 1234 IN", group: "PCC 2 Inner", multiplier: 0.42, voltageBase: 433 },
//   { key: "pcc2-rm1-b", label: "PCC 2 · RM1 B", group: "PCC 2 Inner", multiplier: 0.35, voltageBase: 433 },
//   { key: "pcc2-rm2-b", label: "PCC 2 · RM2 B", group: "PCC 2 Inner", multiplier: 0.33, voltageBase: 433 },
//   { key: "pcc2-utility2", label: "PCC 2 · Utility 2", group: "PCC 2 Inner", multiplier: 0.30, voltageBase: 433 },
//   { key: "pcc2-spare2", label: "PCC 2 · Spare 2", group: "PCC 2 Inner", multiplier: 0.08, voltageBase: 433 },

//   // PCC 3 / PCC 4 INNER — IN + 10 OG EACH
//   { key: "pcc3-lt4-in", label: "PCC 3 · LT4 IN", group: "PCC 3 Inner", multiplier: 0.40, voltageBase: 433 },
//   { key: "pcc3-dg567-in", label: "PCC 3 · DG567 IN", group: "PCC 3 Inner", multiplier: 0.38, voltageBase: 433 },
//   ...Array.from({ length: 10 }, (_, index) => ({
//     key: `pcc3-og-${index + 1}`,
//     label: `PCC 3 · OG ${index + 1}`,
//     group: "PCC 3 Inner",
//     multiplier: 0.28 - index * 0.014,
//     voltageBase: 433,
//   })),
//   { key: "pcc4-lt3-in", label: "PCC 4 · LT3 IN", group: "PCC 4 Inner", multiplier: 0.40, voltageBase: 433 },
//   { key: "pcc4-dg567-in", label: "PCC 4 · DG567 IN", group: "PCC 4 Inner", multiplier: 0.38, voltageBase: 433 },
//   ...Array.from({ length: 10 }, (_, index) => ({
//     key: `pcc4-og-${index + 1}`,
//     label: `PCC 4 · OG ${index + 1}`,
//     group: "PCC 4 Inner",
//     multiplier: 0.28 - index * 0.014,
//     voltageBase: 433,
//   })),

//   // UPS FLOW FROM PCC 1 / PCC 2
//   { key: "ups-30kva-1", label: "UPS 30kVA-1", group: "UPS", multiplier: 0.16, voltageBase: 415 },
//   { key: "ups-30kva-2", label: "UPS 30kVA-2", group: "UPS", multiplier: 0.15, voltageBase: 415 },
//   { key: "ups-10kva-1", label: "UPS 10kVA-1", group: "UPS", multiplier: 0.08, voltageBase: 415 },
//   { key: "ups-10kva-2", label: "UPS 10kVA-2", group: "UPS", multiplier: 0.075, voltageBase: 415 },

//   // RAISING MAIN
//   { key: "raising-main", label: "Raising Main", group: "Raising Main", multiplier: 0.66, voltageBase: 433 },
//   { key: "rm-1", label: "Raising Main 1", group: "Raising Main", multiplier: 0.34, voltageBase: 433 },
//   { key: "rm-2", label: "Raising Main 2", group: "Raising Main", multiplier: 0.32, voltageBase: 433 },
//   { key: "rm-3", label: "Raising Main 3", group: "Raising Main", multiplier: 0.31, voltageBase: 433 },
//   { key: "rm-4", label: "Raising Main 4", group: "Raising Main", multiplier: 0.29, voltageBase: 433 },

//   // WINGS
//   { key: "wing-a", label: "Wing A", group: "Wing", multiplier: 0.30, voltageBase: 433 },
//   { key: "wing-b", label: "Wing B", group: "Wing", multiplier: 0.28, voltageBase: 433 },

//   // DIESEL GENERATORS — 7
//   { key: "dg", label: "Diesel Generator Plant", group: "DG", multiplier: 0.52, voltageBase: 433 },
//   ...Array.from({ length: 7 }, (_, index) => ({
//     key: `dg-${index + 1}`,
//     label: `DG-${index + 1}`,
//     group: "DG",
//     multiplier: 0.30 - index * 0.018,
//     voltageBase: 433,
//   })),

//   // AUXILIARY SYSTEMS
//   { key: "hvac", label: "HVAC", group: "HVAC", multiplier: 0.34, voltageBase: 433 },
//   { key: "water-management", label: "Water Management", group: "Water Management", multiplier: 0.14, voltageBase: 433 },
//   { key: "stp", label: "STP", group: "Water Management", multiplier: 0.10, voltageBase: 433 },
//   { key: "wtp", label: "WTP", group: "Water Management", multiplier: 0.095, voltageBase: 433 },
//   ...Array.from({ length: 4 }, (_, index) => ({
//     key: `tank-${index + 1}`,
//     label: `Tank Level-${index + 1}`,
//     group: "Water Management",
//     multiplier: 0.045 + index * 0.004,
//     voltageBase: 433,
//   })),
//   // FIRE & LIFE SAFETY — synced with MainOverview
//   { key: "fire-alarms", label: "Fire Alarms", group: "Fire", multiplier: 0.06, voltageBase: 230 },
//   { key: "fire-fighting", label: "Fire Fighting", group: "Fire", multiplier: 0.055, voltageBase: 230 },
//   { key: "fire-pump", label: "Fire Pump", group: "Fire", multiplier: 0.05, voltageBase: 415 },
// ];

// const EQUIPMENT_BY_KEY = Object.fromEntries(
//   EQUIPMENT_OPTIONS.map((equipment) => [equipment.key, equipment]),
// );

// const MAIN_FLOW_OPTIONS = [
//   { key: "source", label: "33kV Source", groups: ["33kV Source"] },
//   { key: "feeder", label: "33kV Feeder", groups: ["33kV Feeder"] },
//   { key: "transformer", label: "Transformer", groups: ["Transformer"] },
//   { key: "kiosk", label: "LT Kiosk", groups: ["LT Kiosk"] },
//   { key: "busbar", label: "Busduct", groups: ["Busduct"] },
//   {
//     key: "pcc",
//     label: "PCC",
//     groups: ["PCC", "PCC 1 Inner", "PCC 2 Inner", "PCC 3 Inner", "PCC 4 Inner"],
//   },
//   { key: "ups", label: "UPS", groups: ["UPS"] },
//   { key: "raising-main", label: "Raising Main", groups: ["Raising Main"] },
//   { key: "wing", label: "Wing", groups: ["Wing"] },
//   { key: "dg", label: "DG", groups: ["DG"] },
//   { key: "hvac", label: "HVAC", groups: ["HVAC"] },
//   { key: "water-management", label: "Water Management", groups: ["Water Management"] },
//   { key: "fire", label: "Fire", groups: ["Fire"] },
// ];

// const PARENT_EQUIPMENT_KEYS = new Set([
//   "source",
//   "feeder",
//   "transformer",
//   "kiosk",
//   "busbar",
//   "pcc",
//   "raising-main",
//   "dg",
//   "water-management",
// ]);

// const getInnerEquipmentForFlow = (flowKey) => {
//   // Main Equipment = All means every individual monitored asset
//   // from every main flow is available for download.
//   if (flowKey === "all") {
//     return EQUIPMENT_OPTIONS.filter(
//       (equipment) => !PARENT_EQUIPMENT_KEYS.has(equipment.key),
//     );
//   }

//   const flow = MAIN_FLOW_OPTIONS.find((item) => item.key === flowKey);
//   if (!flow) return [];

//   let options = EQUIPMENT_OPTIONS.filter(
//     (equipment) =>
//       flow.groups.includes(equipment.group) &&
//       !PARENT_EQUIPMENT_KEYS.has(equipment.key),
//   );

//   // Single-item systems such as HVAC may have no separate children.
//   if (!options.length) {
//     const direct = EQUIPMENT_BY_KEY[flowKey];
//     if (direct) options = [direct];
//   }

//   return options;
// };

// const EQUIPMENT_GROUPS = EQUIPMENT_OPTIONS.reduce((groups, equipment) => {
//   const group = equipment.group || "Other";
//   if (!groups[group]) groups[group] = [];
//   groups[group].push(equipment);
//   return groups;
// }, {});


// const formatDateKey = (date) => {
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, "0");
//   const day = String(date.getDate()).padStart(2, "0");
//   return `${year}-${month}-${day}`;
// };

// const getCurrentMonth = () => {
//   const date = new Date();
//   return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
// };


// const getMainFlowForEquipment = (equipment) => {
//   if (!equipment) return null;

//   return (
//     MAIN_FLOW_OPTIONS.find((flow) =>
//       flow.groups.includes(equipment.group),
//     ) || null
//   );
// };

// const buildFlowSpecificFeatures = ({
//   equipment,
//   equipmentIndex,
//   hour,
//   dayOffset,
//   voltage,
//   current,
//   powerFactor,
//   energyKwh,
//   energyKvah,
// }) => {
//   const key = equipment.key;

//   const electrical = {
//     kWh: Number(energyKwh.toFixed(2)),
//     kVAh: Number(energyKvah.toFixed(2)),
//     voltage: Number(voltage),
//     powerFactor: Number(powerFactor),
//     amps: Number(current),
//     status: "Live",
//   };

//   // ---------------------------------------------------------------
//   // 33kV SOURCE
//   // MainOverview SourceBox monitoring:
//   // kWh | kVAh | PF | Voltage | Current
//   // ---------------------------------------------------------------
//   if (equipment.group === "33kV Source") {
//     const sourceValues = {
//       "source-inc1": { kWh: 1280, kVAh: 1195, powerFactor: 0.98, voltage: 33000, amps: 420 },
//       "source-out": { kWh: 1560, kVAh: 1430, powerFactor: 0.99, voltage: 33000, amps: 460 },
//       "source-inc2": { kWh: 1110, kVAh: 1020, powerFactor: 0.97, voltage: 33000, amps: 390 },
//       "source-meter": { kWh: 1420, kVAh: 1300, powerFactor: 0.98, voltage: 33000, amps: 435 },
//     };

//     return {
//       ...(sourceValues[key] || electrical),
//       status: "Live",
//     };
//   }

//   // ---------------------------------------------------------------
//   // 33kV FEEDER
//   // MainOverview feeder monitoring:
//   // kWh | kVAh | PF | AMPS | Voltage
//   // ---------------------------------------------------------------
//   if (equipment.group === "33kV Feeder") {
//     const feederValues = {
//       "feeder-incoming-1": { kWh: 1480, kVAh: 1360, powerFactor: 0.98, voltage: 33000, amps: 430 },
//       "feeder-og-1": { kWh: 980, kVAh: 910, powerFactor: 0.97, voltage: 33000, amps: 280 },
//       "feeder-og-2": { kWh: 1020, kVAh: 960, powerFactor: 0.98, voltage: 33000, amps: 295 },
//       "feeder-og-3": { kWh: 1120, kVAh: 1040, powerFactor: 0.98, voltage: 33000, amps: 310 },
//       "feeder-og-4": { kWh: 940, kVAh: 870, powerFactor: 0.96, voltage: 33000, amps: 265 },
//       "feeder-og-5": { kWh: 1080, kVAh: 990, powerFactor: 0.98, voltage: 33000, amps: 300 },
//       "feeder-og-6": { kWh: 1150, kVAh: 1080, powerFactor: 0.99, voltage: 33000, amps: 325 },
//     };

//     return {
//       ...(feederValues[key] || electrical),
//       status: "Live",
//     };
//   }

//   // ---------------------------------------------------------------
//   // TRANSFORMER
//   // MainOverview transformer cards:
//   // Oil Temp | Winding Temp | Buchholz Relay | Load
//   // ---------------------------------------------------------------
//   if (equipment.group === "Transformer") {
//     const transformerValues = {
//       "tr-1": { oilTemperature: 54, windingTemperature: 61, buchholzRelay: "Healthy", loadPercent: 68 },
//       "tr-2": { oilTemperature: 52, windingTemperature: 59, buchholzRelay: "Healthy", loadPercent: 62 },
//       "tr-3": { oilTemperature: 55, windingTemperature: 60, buchholzRelay: "Healthy", loadPercent: 71 },
//       "tr-4": { oilTemperature: 53, windingTemperature: 58, buchholzRelay: "Healthy", loadPercent: 65 },
//       "tr-5": { oilTemperature: 56, windingTemperature: 63, buchholzRelay: "Healthy", loadPercent: 74 },
//       "tr-6": { oilTemperature: 51, windingTemperature: 57, buchholzRelay: "Healthy", loadPercent: 60 },
//     };

//     return {
//       ...(transformerValues[key] || {
//         oilTemperature: 54,
//         windingTemperature: 61,
//         buchholzRelay: "Healthy",
//         loadPercent: 68,
//       }),
//       status: "Live",
//     };
//   }

//   // ---------------------------------------------------------------
//   // LT KIOSK
//   // MainOverview KioskMonitorBox:
//   // kWh | kVAh | PF | AMPS | Voltage
//   // ---------------------------------------------------------------
//   if (equipment.group === "LT Kiosk") {
//     const kioskNumber = Number(key.split("-")[1] || 1);
//     return {
//       kWh: 1280 + (kioskNumber - 1) * 60,
//       kVAh: 1195 + (kioskNumber - 1) * 55,
//       powerFactor: kioskNumber % 2 === 1 ? 0.98 : 0.97,
//       amps: 420 + (kioskNumber - 1) * 8,
//       voltage: 433,
//       status: "Live",
//     };
//   }

//   // ---------------------------------------------------------------
//   // BUSDuct / BUSBAR
//   // MainOverview BusbarMonitorBox:
//   // Temp | Vibration | Health
//   // ---------------------------------------------------------------
//   if (equipment.group === "Busduct") {
//     const busNumber = Number(key.split("-")[1] || 1);
//     return {
//       temperature: 42 + (busNumber - 1),
//       vibration: "Normal",
//       health: "ON",
//       status: "Live",
//     };
//   }

//   // ---------------------------------------------------------------
//   // PCC
//   // MainOverview PanelFeatures:
//   // kWh | kVAh | V | PF | Amps + Live/Inactive status
//   // ---------------------------------------------------------------
//   if (
//     equipment.group === "PCC" ||
//     equipment.group === "PCC 1 Inner" ||
//     equipment.group === "PCC 2 Inner" ||
//     equipment.group === "PCC 3 Inner" ||
//     equipment.group === "PCC 4 Inner"
//   ) {
//     return {
//       kWh: 1245 + (equipmentIndex % 14) * 18,
//       kVAh: 1180 + (equipmentIndex % 14) * 15,
//       voltage: 433,
//       powerFactor: equipmentIndex % 2 === 0 ? 0.98 : 0.97,
//       amps: 210 + (equipmentIndex % 14) * 4,
//       status: "Live",
//     };
//   }

//   // ---------------------------------------------------------------
//   // UPS
//   // MainOverview createUpsMonitoringData:
//   // Capacity | Input V | Output V | Load | Battery | Input Hz |
//   // Output Hz | Battery V | Backup Time | Mode | Status
//   // ---------------------------------------------------------------
//   if (equipment.group === "UPS") {
//     const upsIndex = Math.max(
//       0,
//       ["ups-30kva-1", "ups-30kva-2", "ups-10kva-1", "ups-10kva-2"].indexOf(key),
//     );
//     const is30kva = key.includes("30kva");

//     return {
//       capacity: is30kva ? "30 kVA" : "10 kVA",
//       inputVoltage: is30kva ? 414 + upsIndex : 412 + upsIndex,
//       outputVoltage: is30kva ? 415 + (upsIndex % 2) : 414 + (upsIndex % 2),
//       loadPercent: is30kva ? 66 + upsIndex * 3 : 48 + upsIndex * 4,
//       batteryPercent: 94 - upsIndex * 2,
//       inputFrequency: 50.0,
//       outputFrequency: 50.0,
//       batteryVoltage: is30kva ? 216 - upsIndex : 192 - upsIndex,
//       backupTimeMinutes: is30kva ? 42 - upsIndex * 3 : 58 - upsIndex * 4,
//       mode: "Online",
//       status: "Normal",
//     };
//   }

//   // ---------------------------------------------------------------
//   // RAISING MAIN
//   // MainOverview RMBox:
//   // kWh | kVAh | V | PF | Amps + Live/Inactive
//   // ---------------------------------------------------------------
//   if (equipment.group === "Raising Main") {
//     const rmNumber = Number(key.split("-")[1] || 1);
//     return {
//       kWh: 1245 + (rmNumber - 1) * 65,
//       kVAh: 1180 + (rmNumber - 1) * 58,
//       voltage: 433,
//       powerFactor: rmNumber % 2 === 1 ? 0.98 : 0.97,
//       amps: 210 + (rmNumber - 1) * 12,
//       status: "Live",
//     };
//   }

//   // ---------------------------------------------------------------
//   // DG
//   // MainOverview DgMonitorBox:
//   // kWh | kVAh | PF | AMPS | Voltage
//   // ---------------------------------------------------------------
//   if (equipment.group === "DG") {
//     const dgNumber = Number(key.split("-")[1] || 1);
//     return {
//       kWh: 1460 + (dgNumber - 1) * 75,
//       kVAh: 1375 + (dgNumber - 1) * 68,
//       powerFactor: (dgNumber - 1) % 3 === 0 ? 0.97 : 0.98,
//       amps: 510 + (dgNumber - 1) * 14,
//       voltage: 433,
//       status: "Live",
//     };
//   }

//   // ---------------------------------------------------------------
//   // WATER MANAGEMENT
//   // MainOverview STP/WTP:
//   // Inlet Flow | Outlet Flow | pH | Turbidity | Status
//   // MainOverview Tanks:
//   // Level | Volume | Inlet Flow | Outlet Flow | Status
//   // ---------------------------------------------------------------
//   if (equipment.group === "Water Management") {
//     if (key === "stp") {
//       return {
//         inletFlow: 82,
//         outletFlow: 76,
//         ph: 7.2,
//         turbidity: 2.4,
//         status: "Running",
//       };
//     }

//     if (key === "wtp") {
//       return {
//         inletFlow: 96,
//         outletFlow: 91,
//         ph: 7.1,
//         turbidity: 1.8,
//         status: "Running",
//       };
//     }

//     const tankValues = {
//       "tank-1": { levelPercent: 78, volumePercent: 78, inletFlow: 34, outletFlow: 29, status: "Normal" },
//       "tank-2": { levelPercent: 64, volumePercent: 64, inletFlow: 28, outletFlow: 25, status: "Normal" },
//       "tank-3": { levelPercent: 86, volumePercent: 86, inletFlow: 31, outletFlow: 27, status: "Normal" },
//       "tank-4": { levelPercent: 52, volumePercent: 52, inletFlow: 24, outletFlow: 22, status: "Normal" },
//     };

//     if (tankValues[key]) return tankValues[key];
//   }

//   // ---------------------------------------------------------------
//   // FIRE & LIFE SAFETY
//   // Synced with the current MainOverview Fire popup.
//   // ---------------------------------------------------------------
//   if (equipment.group === "Fire") {
//     if (key === "fire-alarms") {
//       return {
//         smokeDetectors: 128,
//         heatDetectors: 64,
//         alarmZones: 12,
//         activeAlarms: 0,
//         status: "Active",
//       };
//     }

//     if (key === "fire-fighting") {
//       return {
//         systemPressure: 7.2,
//         hydrantNetwork: "Normal",
//         sprinklerNetwork: "Normal",
//         mainValve: "Open",
//         status: "Active",
//       };
//     }

//     if (key === "fire-pump") {
//       return {
//         dischargePressure: 7.5,
//         pumpState: "Standby",
//         autoMode: "Enabled",
//         controller: "Healthy",
//         status: "Active",
//       };
//     }
//   }

//   // Wing and HVAC do not expose detailed monitoring fields in MainOverview.
//   if (
//     equipment.group === "Wing" ||
//     equipment.group === "HVAC"
//   ) {
//     return { status: "Active" };
//   }

//   return electrical;
// };

// const getFlowFeatureColumns = (equipment) => {
//   if (!equipment) return [];

//   const electricalColumns = [
//     ["kWh", (row) => row.featureData?.kWh],
//     ["kVAh", (row) => row.featureData?.kVAh],
//     ["PF", (row) => row.featureData?.powerFactor],
//     [
//       "V / kV",
//       (row) =>
//         getDisplayVoltage(
//           row.featureData?.voltage ?? row.voltage,
//         ),
//     ],
//     ["Amps", (row) => row.featureData?.amps],
//     ["Status", (row) => row.featureData?.status],
//   ];

//   if (equipment.group === "Transformer") {
//     return [
//       ["Oil Temp °C", (row) => row.featureData?.oilTemperature],
//       ["Winding Temp °C", (row) => row.featureData?.windingTemperature],
//       ["Buchholz Relay", (row) => row.featureData?.buchholzRelay],
//       ["Load %", (row) => row.featureData?.loadPercent],
//       ["Status", (row) => row.featureData?.status],
//     ];
//   }

//   if (equipment.group === "Busduct") {
//     return [
//       ["Temperature °C", (row) => row.featureData?.temperature],
//       ["Vibration", (row) => row.featureData?.vibration],
//       ["Health", (row) => row.featureData?.health],
//       ["Status", (row) => row.featureData?.status],
//     ];
//   }

//   if (equipment.group === "UPS") {
//     return [
//       ["Capacity", (row) => row.featureData?.capacity],
//       ["Input Voltage V", (row) => row.featureData?.inputVoltage],
//       ["Output Voltage V", (row) => row.featureData?.outputVoltage],
//       ["Load %", (row) => row.featureData?.loadPercent],
//       ["Battery %", (row) => row.featureData?.batteryPercent],
//       ["Input Frequency Hz", (row) => row.featureData?.inputFrequency],
//       ["Output Frequency Hz", (row) => row.featureData?.outputFrequency],
//       ["Battery Voltage V DC", (row) => row.featureData?.batteryVoltage],
//       ["Backup Time min", (row) => row.featureData?.backupTimeMinutes],
//       ["Mode", (row) => row.featureData?.mode],
//       ["Status", (row) => row.featureData?.status],
//     ];
//   }

//   if (equipment.group === "Water Management") {
//     if (equipment.key === "stp" || equipment.key === "wtp") {
//       return [
//         ["Inlet Flow m³/h", (row) => row.featureData?.inletFlow],
//         ["Outlet Flow m³/h", (row) => row.featureData?.outletFlow],
//         ["pH", (row) => row.featureData?.ph],
//         ["Turbidity NTU", (row) => row.featureData?.turbidity],
//         ["Status", (row) => row.featureData?.status],
//       ];
//     }

//     if (equipment.key.startsWith("tank-")) {
//       return [
//         ["Level %", (row) => row.featureData?.levelPercent],
//         ["Volume %", (row) => row.featureData?.volumePercent],
//         ["Inlet Flow m³/h", (row) => row.featureData?.inletFlow],
//         ["Outlet Flow m³/h", (row) => row.featureData?.outletFlow],
//         ["Status", (row) => row.featureData?.status],
//       ];
//     }
//   }

//   if (equipment.group === "Fire") {
//     if (equipment.key === "fire-alarms") {
//       return [
//         ["Smoke Detectors", (row) => row.featureData?.smokeDetectors],
//         ["Heat Detectors", (row) => row.featureData?.heatDetectors],
//         ["Alarm Zones", (row) => row.featureData?.alarmZones],
//         ["Active Alarms", (row) => row.featureData?.activeAlarms],
//         ["Status", (row) => row.featureData?.status],
//       ];
//     }

//     if (equipment.key === "fire-fighting") {
//       return [
//         ["System Pressure bar", (row) => row.featureData?.systemPressure],
//         ["Hydrant Network", (row) => row.featureData?.hydrantNetwork],
//         ["Sprinkler Network", (row) => row.featureData?.sprinklerNetwork],
//         ["Main Valve", (row) => row.featureData?.mainValve],
//         ["Status", (row) => row.featureData?.status],
//       ];
//     }

//     if (equipment.key === "fire-pump") {
//       return [
//         ["Discharge Pressure bar", (row) => row.featureData?.dischargePressure],
//         ["Pump State", (row) => row.featureData?.pumpState],
//         ["Auto Mode", (row) => row.featureData?.autoMode],
//         ["Controller", (row) => row.featureData?.controller],
//         ["Status", (row) => row.featureData?.status],
//       ];
//     }
//   }

//   if (
//     equipment.group === "Wing" ||
//     equipment.group === "HVAC"
//   ) {
//     return [["Status", (row) => row.featureData?.status]];
//   }

//   return electricalColumns;
// };

// const getSelectedFeatureColumns = (
//   equipmentKeys,
//   equipmentOptions,
// ) => {
//   const columns = [];
//   const seen = new Set();

//   equipmentOptions
//     .filter((equipment) => equipmentKeys.includes(equipment.key))
//     .forEach((equipment) => {
//       getFlowFeatureColumns(equipment).forEach(([heading]) => {
//         if (!seen.has(heading)) {
//           seen.add(heading);
//           columns.push(heading);
//         }
//       });
//     });

//   return columns;
// };

// const getFeatureValueByHeading = (row, heading) => {
//   const equipment = EQUIPMENT_BY_KEY[row.equipment];
//   if (!equipment) return "";

//   const column = getFlowFeatureColumns(equipment).find(
//     ([columnHeading]) => columnHeading === heading,
//   );

//   if (!column) return "";

//   const value = column[1](row);
//   return value ?? "";
// };

// const getLatestMonitoringRow = (rows, equipmentKey) => {
//   const equipmentRows = rows
//     .filter((row) => row.equipment === equipmentKey)
//     .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

//   return equipmentRows[0] || null;
// };

// const getMonitoringFeatureCards = (rows, equipmentKey) => {
//   const equipment = EQUIPMENT_BY_KEY[equipmentKey];
//   const row = getLatestMonitoringRow(rows, equipmentKey);

//   if (!equipment || !row) return [];

//   return getFlowFeatureColumns(equipment)
//     .filter(([heading]) => heading !== "Status")
//     .map(([heading, accessor]) => ({
//       label: heading,
//       value: accessor(row),
//     }));
// };

// const buildFlowWiseExportRows = (rows, equipments, selectedPeriod) => {
//   const result = [];
//   const isHourlyOutput = selectedPeriod === "hourly" || selectedPeriod === "daily";

//   equipments.forEach((equipment) => {
//     const equipmentRows = rows
//       .filter((row) => row.equipment === equipment.key)
//       .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

//     if (!equipmentRows.length) return;

//     if (isHourlyOutput) {
//       equipmentRows.forEach((row) => {
//         result.push({
//           equipment,
//           periodValue:
//             selectedPeriod === "hourly"
//               ? row.timestamp.slice(11, 16)
//               : `${row.timestamp.slice(0, 10)} ${row.timestamp.slice(11, 16)}`,
//           sourceRow: row,
//         });
//       });
//       return;
//     }

//     const groups = equipmentRows.reduce((acc, row) => {
//       let key = row.timestamp.slice(0, 10);

//       if (selectedPeriod === "weekly") {
//         key = row.timestamp.slice(0, 10);
//       } else if (selectedPeriod === "monthly") {
//         key = row.timestamp.slice(0, 10);
//       } else if (selectedPeriod === "custom") {
//         key = row.timestamp.slice(0, 10);
//       }

//       if (!acc[key]) acc[key] = [];
//       acc[key].push(row);
//       return acc;
//     }, {});

//     Object.entries(groups)
//       .sort(([a], [b]) => a.localeCompare(b))
//       .forEach(([key, groupRows]) => {
//         const latest = groupRows[groupRows.length - 1];
//         const aggregate = {
//           ...latest,

//           // Preserve the exact latest monitoring payload for this
//           // equipment first. Transformer/Busduct/UPS/Water values are
//           // therefore never replaced by generic electrical fields.
//           featureData: {
//             ...latest.featureData,
//           },
//         };

//         // Only electrical equipment uses cumulative/average electrical
//         // metrics for daily/weekly/monthly exports.
//         const electricalGroups = new Set([
//           "33kV Source",
//           "33kV Feeder",
//           "LT Kiosk",
//           "PCC",
//           "PCC 1 Inner",
//           "PCC 2 Inner",
//           "PCC 3 Inner",
//           "PCC 4 Inner",
//           "Raising Main",
//           "DG",
//         ]);

//         if (electricalGroups.has(equipment.group)) {
//           aggregate.energyKwh = sumBy(groupRows, "energyKwh");
//           aggregate.energyKvah = sumBy(groupRows, "energyKvah");
//           aggregate.voltage = averageBy(groupRows, "voltage");
//           aggregate.current = averageBy(groupRows, "current");
//           aggregate.powerFactor = averageBy(groupRows, "powerFactor");

//           aggregate.featureData = {
//             ...aggregate.featureData,
//             kWh: roundExcel(sumBy(groupRows, "energyKwh"), 2),
//             kVAh: roundExcel(sumBy(groupRows, "energyKvah"), 2),
//             voltage: roundExcel(averageBy(groupRows, "voltage"), 2),
//             amps: roundExcel(averageBy(groupRows, "current"), 2),
//             powerFactor: roundExcel(
//               averageBy(groupRows, "powerFactor"),
//               3,
//             ),
//           };
//         }

//         result.push({
//           equipment,
//           periodValue: key,
//           sourceRow: aggregate,
//         });
//       });
//   });

//   return result;
// };

// const generateAnalyticsData = () => {
//   const rows = [];
//   const today = new Date();

//   for (let dayOffset = 60; dayOffset >= 0; dayOffset -= 1) {
//     const date = new Date(today);
//     date.setDate(today.getDate() - dayOffset);
//     const dateKey = formatDateKey(date);

//     EQUIPMENT_OPTIONS.forEach((equipment, equipmentIndex) => {
//       const multiplier = equipment.multiplier ?? 0.5;

//       for (let hour = 0; hour < 24; hour += 1) {
//         const daylightFactor =
//           hour >= 6 && hour <= 22
//             ? 0.72 + Math.sin(((hour - 6) / 16) * Math.PI) * 0.38
//             : 0.52;

//         const weekdayFactor =
//           date.getDay() === 0 || date.getDay() === 6 ? 0.88 : 1;

//         const baseIncoming = 1080 * multiplier * daylightFactor * weekdayFactor;

//         const dailyNoise =
//           ((dayOffset * 13 + hour * 7 + equipmentIndex * 11) % 35) - 17;

//         const incomingKw = Math.max(30, Math.round(baseIncoming + dailyNoise));

//         const lossRatio =
//           0.025 + (equipmentIndex % 8) * 0.004;

//         const outgoingKw = Math.max(
//           20,
//           Math.round(incomingKw * (1 - lossRatio)),
//         );

//         const energyKwh = Number(((incomingKw + outgoingKw) / 2).toFixed(2));

//         const voltageBase = equipment.voltageBase ?? 433;

//         const voltageVariation =
//           voltageBase >= 10000
//             ? ((hour + dayOffset) % 9) * 18 - 72
//             : ((hour + equipmentIndex) % 7) - 3;

//         const voltage = voltageBase + voltageVariation;
//         const current = Number(
//           (
//             (outgoingKw * 1000) /
//             (Math.sqrt(3) * voltage * (0.95 + (equipmentIndex % 3) * 0.01))
//           ).toFixed(2),
//         );

//         const powerFactor = Number(
//           (0.95 + ((hour + equipmentIndex) % 4) * 0.01).toFixed(2),
//         );

//         // Frontend apparent-energy value.
//         // Later replace with the actual meter/API kVAh register.
//         const energyKvah = Number(
//           (energyKwh / Math.max(powerFactor, 0.01)).toFixed(2),
//         );

//         const timestamp = `${dateKey}T${String(hour).padStart(2, "0")}:00:00`;

//         const featureData = buildFlowSpecificFeatures({
//           equipment,
//           equipmentIndex,
//           hour,
//           dayOffset,
//           voltage,
//           current,
//           powerFactor,
//           energyKwh,
//           energyKvah,
//         });

//         rows.push({
//           timestamp,
//           equipment: equipment.key,
//           equipmentLabel: equipment.label,
//           flowGroup: equipment.group || equipment.label,
//           incomingKw,
//           outgoingKw,
//           energyKwh,
//           energyKvah,
//           voltage,
//           current,
//           powerFactor,
//           featureData,
//           status:
//             featureData?.status ||
//             (outgoingKw / incomingKw < 0.88 ? "Attention" : "Normal"),
//         });
//       }
//     });
//   }

//   return rows;
// };

// const ANALYTICS_DATA = generateAnalyticsData();

// const Card = ({ children, className = "" }) => (
//   <div
//     className={`relative overflow-hidden rounded-[14px] border border-[#C9D8E7] bg-white shadow-[0_10px_26px_rgba(8,31,92,0.07)] ${className}`}
//   >
//     <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#17A8DB]/45 to-transparent" />
//     {children}
//   </div>
// );

// const SectionTitle = ({ title, subtitle, rightContent, icon: Icon }) => (
//   <div className="mb-2.5 flex flex-wrap items-center justify-between gap-3">
//     <div className="flex items-start gap-3">
//       {Icon && (
//         <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px] border border-[#C9DCEF] bg-[linear-gradient(145deg,#F8FBFF,#E8F2FA)] text-[#1B73C9] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
//           <Icon size={18} strokeWidth={2} />
//         </div>
//       )}

//       <div>
//         <h2 className="text-[14px] font-semibold tracking-[-0.01em] text-[#06224F]">
//           {title}
//         </h2>

//         {subtitle && (
//           <p className="mt-1 max-w-3xl text-[9px] leading-relaxed text-[#687F99]">
//             {subtitle}
//           </p>
//         )}
//       </div>
//     </div>

//     {rightContent}
//   </div>
// );

// const RestrictedState = ({ title, message, icon: Icon = ShieldCheck }) => (
//   <Card className="flex h-full min-h-[260px] flex-col items-center justify-center p-6 text-center">
//     <div className="flex h-12 w-12 items-center justify-center rounded-[14px] border border-amber-200 bg-amber-50 text-amber-600">
//       <Icon size={22} />
//     </div>
//     <h3 className="mt-4 text-[15px] font-bold text-[#06224F]">
//       {title}
//     </h3>
//     <p className="mt-2 max-w-md text-[11px] leading-6 text-[#687F99]">
//       {message}
//     </p>
//   </Card>
// );

// const MetricCard = ({
//   label,
//   value,
//   unit,
//   tone = "blue",
//   icon: Icon,
//   trend,
// }) => {
//   const toneMap = {
//     blue: {
//       text: "text-[#1B73C9]",
//       icon: "text-[#1B73C9]",
//       iconBg: "bg-[#EAF4FD]",
//       iconBorder: "border-[#D8E6FF]",
//       accent: "from-[#1B73C9] to-[#17A8DB]",
//     },
//     cyan: {
//       text: "text-[#0E86B7]",
//       icon: "text-[#0E86B7]",
//       iconBg: "bg-[#ECFEFF]",
//       iconBorder: "border-[#C7F1F5]",
//       accent: "from-[#17A8DB] to-[#5DD9FF]",
//     },
//     green: {
//       text: "text-[#15805F]",
//       icon: "text-[#15805F]",
//       iconBg: "bg-[#ECFDF5]",
//       iconBorder: "border-[#CBEFDB]",
//       accent: "from-[#16A34A] to-[#34D399]",
//     },
//     amber: {
//       text: "text-[#B7791F]",
//       icon: "text-[#B7791F]",
//       iconBg: "bg-[#FFF8E8]",
//       iconBorder: "border-[#F8E4B0]",
//       accent: "from-[#F59E0B] to-[#FBBF24]",
//     },
//     red: {
//       text: "text-[#B42318]",
//       icon: "text-[#B42318]",
//       iconBg: "bg-[#FFF1F2]",
//       iconBorder: "border-[#FFD5D9]",
//       accent: "from-[#DC2626] to-[#F87171]",
//     },
//   };

//   const activeTone = toneMap[tone] || toneMap.blue;

//   return (
//     <Card className="print-safe group flex h-full min-h-0 flex-col justify-between p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#BDD2E8] hover:shadow-[0_18px_42px_rgba(8,31,92,0.12)]">
//       <div
//         className={`absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r ${activeTone.accent}`}
//       />

//       <div className="flex items-start justify-between gap-3">
//         <div className="min-w-0">
//           <p className="text-[13px] font-bold uppercase tracking-[0.08em] text-[#5E738B]">
//             {label}
//           </p>

//           <div className="mt-3 flex min-w-0 flex-wrap items-end gap-x-2 gap-y-1">
//             <h3
//               className={`max-w-full break-words text-[clamp(18px,1.8vw,22px)] font-medium leading-tight tracking-[-0.02em] ${activeTone.text}`}
//             >
//               {value}
//             </h3>

//             {unit && (
//               <span className="pb-1 text-[11px] font-medium uppercase text-[#7C91A8]">
//                 {unit}
//               </span>
//             )}
//           </div>
//         </div>

//         {Icon && (
//           <div
//             className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[11px] border ${activeTone.iconBorder} ${activeTone.iconBg} ${activeTone.icon}`}
//           >
//             <Icon size={20} strokeWidth={2} />
//           </div>
//         )}
//       </div>

//       {trend && (
//         <div className="mt-3 flex justify-end">
//           <span className="rounded-full border border-[#CBEFDB] bg-[#ECFDF5] px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.08em] text-[#15805F]">
//             {trend}
//           </span>
//         </div>
//       )}
//     </Card>
//   );
// };

// const TrendChart = ({ rows }) => {
//   if (!rows.length) {
//     return (
//       <div className="flex h-[260px] items-center justify-center text-[11px] text-[#687F99]">
//         No analytics data found for the selected filters.
//       </div>
//     );
//   }

//   const width = 820;
//   const height = 230;
//   const left = 58;
//   const right = 790;
//   const top = 24;
//   const bottom = 180;
//   const chartWidth = right - left;
//   const chartHeight = bottom - top;

//   const maxValue = Math.max(
//     ...rows.flatMap((row) => [row.incomingKw, row.outgoingKw]),
//     1,
//   );

//   const step = Math.max(1, Math.ceil(rows.length / 24));
//   const chartRows = rows.filter(
//     (_, index) => index % step === 0 || index === rows.length - 1,
//   );

//   const coordinates = chartRows.map((row, index) => {
//     const x =
//       chartRows.length === 1
//         ? left
//         : left + (index / (chartRows.length - 1)) * chartWidth;

//     return {
//       x,
//       incomingY: bottom - (Number(row.incomingKw) / maxValue) * chartHeight,
//       outgoingY: bottom - (Number(row.outgoingKw) / maxValue) * chartHeight,
//       row,
//     };
//   });

//   const incomingPoints = coordinates
//     .map((item) => `${item.x},${item.incomingY}`)
//     .join(" ");

//   const outgoingPoints = coordinates
//     .map((item) => `${item.x},${item.outgoingY}`)
//     .join(" ");

//   const labelStep = Math.max(1, Math.ceil(coordinates.length / 7));

//   return (
//     <svg
//       viewBox={`0 0 ${width} ${height}`}
//       preserveAspectRatio="xMidYMid meet"
//       className="h-full min-h-[220px] w-full"
//     >
//       {[0, 1, 2, 3, 4].map((index) => {
//         const y = top + index * (chartHeight / 4);
//         const value = maxValue - index * (maxValue / 4);

//         return (
//           <React.Fragment key={index}>
//             <line
//               x1={left}
//               x2={right}
//               y1={y}
//               y2={y}
//               stroke="rgba(8,31,92,0.10)"
//               strokeDasharray="4 4"
//             />
//             <text
//               x={left - 8}
//               y={y + 3}
//               textAnchor="end"
//               fontSize="8"
//               fill="#8192A7"
//             >
//               {Math.round(value)}
//             </text>
//           </React.Fragment>
//         );
//       })}

//       <polyline
//         points={incomingPoints}
//         fill="none"
//         stroke="#17A8DB"
//         strokeWidth="3"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />

//       <polyline
//         points={outgoingPoints}
//         fill="none"
//         stroke="#06224F"
//         strokeWidth="3"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />

//       {coordinates.map((item, index) => (
//         <g key={`${item.row.timestamp}-${index}`}>
//           <circle cx={item.x} cy={item.incomingY} r="3" fill="#17A8DB" />
//           <circle cx={item.x} cy={item.outgoingY} r="3" fill="#06224F" />

//           <title>
//             {`${new Date(item.row.timestamp).toLocaleString()} | Incoming ${item.row.incomingKw} kW | Outgoing ${item.row.outgoingKw} kW`}
//           </title>

//           {(index % labelStep === 0 || index === coordinates.length - 1) && (
//             <text
//               x={item.x}
//               y="205"
//               textAnchor="middle"
//               fontSize="8"
//               fill="#687F99"
//             >
//               {new Date(item.row.timestamp).toLocaleDateString(undefined, {
//                 month: "short",
//                 day: "2-digit",
//                 hour: "2-digit",
//               })}
//             </text>
//           )}
//         </g>
//       ))}

//       <g transform="translate(610,15)">
//         <circle cx="0" cy="0" r="4" fill="#17A8DB" />
//         <text x="10" y="3" fontSize="9" fill="#687F99">
//           Incoming
//         </text>

//         <circle cx="90" cy="0" r="4" fill="#06224F" />
//         <text x="100" y="3" fontSize="9" fill="#687F99">
//           Outgoing
//         </text>
//       </g>
//     </svg>
//   );
// };

// const EnergyBars = ({ rows }) => {
//   if (!rows.length) {
//     return null;
//   }

//   const grouped = rows.reduce((accumulator, row) => {
//     const key = row.timestamp.slice(0, 13);
//     accumulator[key] = (accumulator[key] || 0) + Number(row.energyKwh || 0);
//     return accumulator;
//   }, {});

//   const points = Object.entries(grouped).slice(-12);
//   const maxValue = Math.max(...points.map(([, value]) => value), 1);

//   return (
//     <div className="flex h-full min-h-0 items-end gap-2 pb-1">
//       {points.map(([label, value]) => (
//         <div
//           key={label}
//           className="flex min-w-0 flex-1 flex-col items-center justify-end"
//         >
//           <div className="mb-2 text-[8px] font-semibold text-[#06224F]">
//             {Math.round(value)}
//           </div>

//           <div
//             className="w-full max-w-[30px] rounded-t-[8px] bg-[linear-gradient(180deg,#17A8DB_0%,#1B73C9_100%)] shadow-[0_8px_16px_rgba(37,99,235,0.16)]"
//             style={{
//               height: `${Math.max(10, (value / maxValue) * 70)}px`,
//             }}
//           />

//           <p className="mt-1.5 truncate text-[7px] text-[#687F99]">
//             {label.slice(11, 13)}h
//           </p>
//         </div>
//       ))}
//     </div>
//   );
// };

// const escapeCsv = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;

// const triggerDownload = (blob, filename) => {
//   const url = URL.createObjectURL(blob);
//   const link = document.createElement("a");

//   link.href = url;
//   link.download = filename;
//   document.body.appendChild(link);
//   link.click();
//   link.remove();
//   URL.revokeObjectURL(url);
// };

// const getFirstBuildingIdFromScope = (account) => {
//   const assignedBuildingId = account?.assignedBuildingIds?.[0];
//   const assignedFloorId = account?.assignedFloorIds?.[0];

//   return (
//     assignedBuildingId ||
//     normalizeId(assignedFloorId).split(":")[0] ||
//     buildings[0]?.id ||
//     ""
//   );
// };

// const getFirstFloorIdFromScope = (account, buildingId) => {
//   const assignedFloorId = account?.assignedFloorIds?.find((floorId) =>
//     normalizeId(floorId).startsWith(`${buildingId}:`)
//   );

//   return assignedFloorId || (buildingId ? `${buildingId}:1` : "");
// };

// const scaleReadingForZoneCount = (row, zoneCount) => ({
//   ...row,
//   incomingKw: Math.max(0, Math.round(Number(row.incomingKw || 0) / zoneCount)),
//   outgoingKw: Math.max(0, Math.round(Number(row.outgoingKw || 0) / zoneCount)),
//   energyKwh: Number((Number(row.energyKwh || 0) / zoneCount).toFixed(2)),
//   energyKvah: Number((Number(row.energyKvah || 0) / zoneCount).toFixed(2)),
//   current: Number((Number(row.current || 0) / zoneCount).toFixed(2)),
// });


// const roundExcel = (value, digits = 2) => {
//   const multiplier = 10 ** digits;
//   return Math.round((Number(value) + Number.EPSILON) * multiplier) / multiplier;
// };

// const getVoltageUnit = (voltage) =>
//   Number(voltage) >= 10000 ? "kV" : "V";

// const getDisplayVoltage = (voltage) =>
//   Number(voltage) >= 10000
//     ? roundExcel(Number(voltage) / 1000, 2)
//     : roundExcel(Number(voltage), 2);

// const averageBy = (rows, field) => {
//   if (!rows.length) return 0;
//   return (
//     rows.reduce(
//       (sum, row) => sum + Number(row[field] || 0),
//       0,
//     ) / rows.length
//   );
// };

// const sumBy = (rows, field) =>
//   rows.reduce(
//     (sum, row) => sum + Number(row[field] || 0),
//     0,
//   );

// const startOfWeekMonday = (dateValue) => {
//   const date = new Date(`${dateValue}T00:00:00`);
//   const day = date.getDay();
//   const diff = day === 0 ? -6 : 1 - day;
//   date.setDate(date.getDate() + diff);
//   date.setHours(0, 0, 0, 0);
//   return date;
// };

// const endOfWeekSunday = (weekStart) => {
//   const end = new Date(weekStart);
//   end.setDate(end.getDate() + 6);
//   return end;
// };


// const buildRealtimeSnapshot = (equipment, latestRow) => {
//   if (!equipment || !latestRow) return null;

//   const now = new Date();
//   const hourStart = new Date(now);
//   hourStart.setMinutes(0, 0, 0);

//   // Frontend-live snapshot based on the latest available reading.
//   // Replace the values below directly with the realtime BMS/API response later.
//   const minuteFactor = now.getMinutes() / 60;
//   const incomingKw = Math.max(
//     1,
//     Number(latestRow.incomingKw || 0) * (0.97 + minuteFactor * 0.04),
//   );
//   const outgoingKw = Math.max(
//     1,
//     Number(latestRow.outgoingKw || 0) * (0.97 + minuteFactor * 0.035),
//   );
//   const voltage = Number(latestRow.voltage || equipment.voltageBase || 433);
//   const powerFactor = Number(latestRow.powerFactor || 0.98);
//   const current = Number(
//     (
//       (outgoingKw * 1000) /
//       (Math.sqrt(3) * Math.max(voltage, 1) * Math.max(powerFactor, 0.01))
//     ).toFixed(2),
//   );

//   const energyKwh = Number(
//     (((incomingKw + outgoingKw) / 2) * Math.max(minuteFactor, 1 / 60)).toFixed(2),
//   );

//   const energyKvah = Number(
//     (energyKwh / Math.max(powerFactor, 0.01)).toFixed(2),
//   );

//   return {
//     ...latestRow,
//     timestamp: `${formatDateKey(hourStart)}T${String(
//       hourStart.getHours(),
//     ).padStart(2, "0")}:00:00`,
//     incomingKw: Number(incomingKw.toFixed(2)),
//     outgoingKw: Number(outgoingKw.toFixed(2)),
//     energyKwh,
//     energyKvah,
//     voltage,
//     current,
//     powerFactor,
//     status:
//       outgoingKw / Math.max(incomingKw, 1) < 0.88
//         ? "Attention"
//         : "Normal",
//     realtime: true,
//   };
// };

// const mergeRealtimeSnapshot = (rows, selectedEquipment) => {
//   if (!rows.length) return rows;

//   const equipment = EQUIPMENT_BY_KEY[selectedEquipment];
//   const sorted = [...rows].sort(
//     (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
//   );

//   const latest = sorted[sorted.length - 1];
//   const snapshot = buildRealtimeSnapshot(equipment, latest);

//   if (!snapshot) return sorted;

//   const snapshotHour = snapshot.timestamp.slice(0, 13);
//   const withoutCurrentHour = sorted.filter(
//     (row) => row.timestamp.slice(0, 13) !== snapshotHour,
//   );

//   return [...withoutCurrentHour, snapshot].sort(
//     (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
//   );
// };

// const buildHourlyExcelRows = (rows) =>
//   [...rows]
//     .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
//     .map((row) => ({
//       Date: row.timestamp.slice(0, 10),
//       Time: row.timestamp.slice(11, 16),
//       "kWh": roundExcel(row.energyKwh, 2),
//       "kVAh": roundExcel(row.energyKvah, 2),
//       "V / kV": getDisplayVoltage(row.voltage),
//       PF: roundExcel(row.powerFactor, 2),
//       Amps: roundExcel(row.current, 2),
//     }));

// const buildDailyExcelRows = (rows) => {
//   const groups = rows.reduce((accumulator, row) => {
//     const key = row.timestamp.slice(0, 10);
//     if (!accumulator[key]) accumulator[key] = [];
//     accumulator[key].push(row);
//     return accumulator;
//   }, {});

//   return Object.entries(groups)
//     .sort(([a], [b]) => a.localeCompare(b))
//     .map(([date, groupRows]) => ({
//       Date: date,
//       "kWh": roundExcel(sumBy(groupRows, "energyKwh"), 2),
//       "kVAh": roundExcel(sumBy(groupRows, "energyKvah"), 2),
//       "V / kV": getDisplayVoltage(averageBy(groupRows, "voltage")),
//       PF: roundExcel(averageBy(groupRows, "powerFactor"), 3),
//       Amps: roundExcel(averageBy(groupRows, "current"), 2),
//     }));
// };

// const buildWeeklyExcelRows = (rows) => {
//   const dailyRows = buildDailyExcelRows(rows);
//   if (!dailyRows.length) return [];

//   const weekStart = startOfWeekMonday(dailyRows[0].Date);
//   const result = [];

//   for (let offset = 0; offset < 7; offset += 1) {
//     const day = new Date(weekStart);
//     day.setDate(day.getDate() + offset);
//     const dateKey = formatDateKey(day);
//     const existing = dailyRows.find((row) => row.Date === dateKey);

//     result.push(
//       existing || {
//         Date: dateKey,
//         "kWh": 0,
//         "kVAh": 0,
//         "V / kV": "",
//         PF: "",
//         Amps: "",
//       },
//     );
//   }

//   return result;
// };

// const buildMonthlyExcelRows = (rows) => {
//   return buildDailyExcelRows(rows);
// };

// const applyExcelSheetLayout = (worksheet, widths) => {
//   worksheet["!cols"] = widths.map((width) => ({ wch: width }));

//   if (worksheet["!ref"]) {
//     worksheet["!autofilter"] = {
//       ref: worksheet["!ref"],
//     };
//   }
// };

// export default function OverviewPage() {
//   const currentUser = tempApi.getCurrentAccount();
//   const canViewReports = accountHasPermission(
//     currentUser,
//     USER_PERMISSIONS.ANALYTICS_VIEW
//   );
//   const canDownloadReports = accountHasPermission(
//     currentUser,
//     USER_PERMISSIONS.DATA_DOWNLOAD
//   );

//   const [selectedMainFlow, setSelectedMainFlow] = useState("source");
//   const [selectedEquipment, setSelectedEquipment] = useState(
//     () => getInnerEquipmentForFlow("source")[0]?.key || "source",
//   );

//   const [selectedPeriod, setSelectedPeriod] = useState("daily");

//   const [selectedDate, setSelectedDate] = useState(formatDateKey(new Date()));

//   const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());

//   const [fromTime, setFromTime] = useState("00:00");
//   const [toTime, setToTime] = useState("23:59");
//   const [customStart, setCustomStart] = useState("");
//   const [customEnd, setCustomEnd] = useState("");
//   const [activeWorkspace, setActiveWorkspace] = useState("analytics");

//   const isPrivilegedAccount =
//     isSuperAdmin(currentUser) ||
//     currentUser?.systemRole === SYSTEM_ROLES.ADMIN;
//   const canViewLiveReadings = accountHasPermission(
//     currentUser,
//     USER_PERMISSIONS.LIVE_MONITORING_VIEW
//   );
//   const accessibleZones = useMemo(() => {
//     if (!currentUser || isPrivilegedAccount) {
//       return [];
//     }

//     const assignedZoneIds = new Set(
//       (currentUser.assignedZoneIds ?? []).map(normalizeId)
//     );

//     return getAllZones().filter((zone) =>
//       assignedZoneIds.has(normalizeId(zone.id))
//     );
//   }, [currentUser, isPrivilegedAccount]);
//   const hasOverviewDataScope =
//     isPrivilegedAccount || accessibleZones.length > 0;

//   const scopedSourceData = useMemo(() => {
//     if (!currentUser) {
//       return [];
//     }

//     if (!isPrivilegedAccount && accessibleZones.length === 0) {
//       return [];
//     }

//     if (!isPrivilegedAccount) {
//       const scopedRows = ANALYTICS_DATA.flatMap((row) => {
//         const zonesForRow =
//           row.equipment === "wing-a" || row.equipment === "wing-b"
//             ? accessibleZones.filter(
//                 (zone) =>
//                   normalizeId(zone.buildingId) === normalizeId(row.equipment)
//               )
//             : accessibleZones;

//         if (zonesForRow.length === 0) {
//           return [];
//         }

//         return zonesForRow.map((zone) => ({
//           ...scaleReadingForZoneCount(row, zonesForRow.length),
//           buildingId: zone.buildingId,
//           blockId: zone.blockId,
//           floorId: zone.floorId,
//           zoneId: zone.id,
//           clientId: zone.clientId,
//           systemId: "",
//         }));
//       });

//       return filterReadingsForAccount(currentUser, scopedRows);
//     }

//     const fallbackBuildingId = getFirstBuildingIdFromScope(currentUser);

//     const scopedRows = ANALYTICS_DATA.map((row) => {
//       const buildingId =
//         row.equipment === "wing-a" || row.equipment === "wing-b"
//           ? row.equipment
//           : fallbackBuildingId;
//       const floorId = getFirstFloorIdFromScope(currentUser, buildingId);
//       const blockId = buildingId ? `${buildingId}-core` : "";

//       return {
//         ...row,
//         buildingId,
//         blockId,
//         floorId,
//         systemId: "",
//         clientId: currentUser?.assignedClientIds?.[0] || "",
//       };
//     });

//     return filterReadingsForAccount(currentUser, scopedRows);
//   }, [accessibleZones, currentUser, isPrivilegedAccount]);

//   const innerEquipmentOptions = useMemo(
//     () => getInnerEquipmentForFlow(selectedMainFlow),
//     [selectedMainFlow],
//   );

//   const selectedMainFlowLabel =
//     selectedMainFlow === "all"
//       ? "All Flows"
//       : MAIN_FLOW_OPTIONS.find((item) => item.key === selectedMainFlow)?.label ||
//         "33kV Source";

//   const isAllInnerEquipment = selectedEquipment === "all";

//   const selectedEquipmentKeys = useMemo(
//     () =>
//       isAllInnerEquipment
//         ? innerEquipmentOptions.map((equipment) => equipment.key)
//         : [selectedEquipment],
//     [innerEquipmentOptions, isAllInnerEquipment, selectedEquipment],
//   );

//   const selectedEquipmentLabel = isAllInnerEquipment
//     ? selectedMainFlow === "all"
//       ? "All Equipment"
//       : `All ${selectedMainFlowLabel}`
//     : EQUIPMENT_BY_KEY[selectedEquipment]?.label ||
//       innerEquipmentOptions[0]?.label ||
//       selectedMainFlowLabel;

//   const selectedFeatureColumns = useMemo(
//     () =>
//       getSelectedFeatureColumns(
//         selectedEquipmentKeys,
//         innerEquipmentOptions,
//       ),
//     [selectedEquipmentKeys, innerEquipmentOptions],
//   );

//   const filteredData = useMemo(() => {
//     return scopedSourceData.filter((row) => {
//       if (!selectedEquipmentKeys.includes(row.equipment)) {
//         return false;
//       }

//       const timestamp = new Date(row.timestamp);
//       const rowDate = row.timestamp.slice(0, 10);
//       const rowMonth = row.timestamp.slice(0, 7);
//       const rowTime = row.timestamp.slice(11, 16);

//       if (selectedPeriod === "hourly") {
//         return (
//           rowDate === selectedDate && rowTime >= fromTime && rowTime <= toTime
//         );
//       }

//       if (selectedPeriod === "daily") {
//         return rowDate === selectedDate;
//       }

//       if (selectedPeriod === "weekly") {
//         const selected = new Date(`${selectedDate}T00:00:00`);
//         const weekStart = new Date(selected);
//         weekStart.setDate(selected.getDate() - selected.getDay());

//         const weekEnd = new Date(weekStart);
//         weekEnd.setDate(weekStart.getDate() + 7);

//         return timestamp >= weekStart && timestamp < weekEnd;
//       }

//       if (selectedPeriod === "monthly") {
//         return rowMonth === selectedMonth;
//       }

//       if (selectedPeriod === "custom") {
//         const start = customStart ? new Date(customStart) : null;
//         const end = customEnd ? new Date(customEnd) : null;

//         if (start && timestamp < start) {
//           return false;
//         }

//         if (end && timestamp > end) {
//           return false;
//         }

//         return true;
//       }

//       return true;
//     });
//   }, [
//     scopedSourceData,
//     selectedEquipment,
//     selectedEquipmentKeys,
//     selectedPeriod,
//     selectedDate,
//     selectedMonth,
//     fromTime,
//     toTime,
//     customStart,
//     customEnd,
//   ]);

//   const selectedMonitoringCards = useMemo(() => {
//     if (selectedEquipment === "all") return [];

//     return getMonitoringFeatureCards(
//       filteredData,
//       selectedEquipment,
//     );
//   }, [filteredData, selectedEquipment]);

//   const selectedMonitoringStatus = useMemo(() => {
//     if (selectedEquipment === "all") return "";

//     const latest = getLatestMonitoringRow(
//       filteredData,
//       selectedEquipment,
//     );

//     return latest?.featureData?.status || latest?.status || "";
//   }, [filteredData, selectedEquipment]);

//   const selectedEquipmentDefinition =
//     selectedEquipment !== "all"
//       ? EQUIPMENT_BY_KEY[selectedEquipment]
//       : null;

//   const selectedUsesElectricalAnalytics =
//     selectedEquipmentDefinition &&
//     ![
//       "Transformer",
//       "Busduct",
//       "UPS",
//       "Water Management",
//       "Wing",
//       "HVAC",
//       "Fire",
//     ].includes(selectedEquipmentDefinition.group);

//   const summary = useMemo(() => {
//     if (!filteredData.length) {
//       return {
//         totalEnergy: 0,
//         peakLoad: 0,
//         averageLoad: 0,
//         totalLoss: 0,
//         efficiency: 0,
//         averageVoltage: 0,
//         averageCurrent: 0,
//         averagePowerFactor: 0,
//       };
//     }

//     const totalEnergy = filteredData.reduce(
//       (sum, row) => sum + Number(row.energyKwh || 0),
//       0,
//     );

//     const peakLoad = Math.max(
//       ...filteredData.map((row) => Number(row.incomingKw || 0)),
//     );

//     const averageLoad =
//       filteredData.reduce((sum, row) => sum + Number(row.outgoingKw || 0), 0) /
//       filteredData.length;

//     const totalIncoming = filteredData.reduce(
//       (sum, row) => sum + Number(row.incomingKw || 0),
//       0,
//     );

//     const totalOutgoing = filteredData.reduce(
//       (sum, row) => sum + Number(row.outgoingKw || 0),
//       0,
//     );

//     const averageVoltage =
//       filteredData.reduce((sum, row) => sum + Number(row.voltage || 0), 0) /
//       filteredData.length;

//     const averageCurrent =
//       filteredData.reduce((sum, row) => sum + Number(row.current || 0), 0) /
//       filteredData.length;

//     const averagePowerFactor =
//       filteredData.reduce((sum, row) => sum + Number(row.powerFactor || 0), 0) /
//       filteredData.length;

//     return {
//       totalEnergy,
//       peakLoad,
//       averageLoad,
//       totalLoss: Math.max(0, totalIncoming - totalOutgoing),
//       efficiency: totalIncoming > 0 ? (totalOutgoing / totalIncoming) * 100 : 0,
//       averageVoltage,
//       averageCurrent,
//       averagePowerFactor,
//     };
//   }, [filteredData]);

//   const downloadCsv = () => {
//     if (!canDownloadReports) return;

//     const matchesSelectedPeriod = (row) => {
//       const rowDate = row.timestamp.slice(0, 10);
//       const rowTime = row.timestamp.slice(11, 16);

//       if (selectedPeriod === "hourly") {
//         const inTime = rowTime >= fromTime && rowTime <= toTime;

//         if (customStart && customEnd && customStart !== customEnd) {
//           return rowDate >= customStart && rowDate <= customEnd && inTime;
//         }

//         return rowDate === selectedDate && inTime;
//       }

//       if (selectedPeriod === "daily") {
//         if (customStart && customEnd && customStart !== customEnd) {
//           return rowDate >= customStart && rowDate <= customEnd;
//         }

//         return rowDate === selectedDate;
//       }

//       if (selectedPeriod === "weekly") {
//         const start = startOfWeekMonday(selectedDate);
//         const end = endOfWeekSunday(start);
//         const current = new Date(`${rowDate}T00:00:00`);
//         return current >= start && current <= end;
//       }

//       if (selectedPeriod === "monthly") {
//         return rowDate.slice(0, 7) === selectedMonth;
//       }

//       if (selectedPeriod === "custom") {
//         return rowDate >= customStart && rowDate <= customEnd;
//       }

//       return true;
//     };

//     const escapeCsv = (value) =>
//       `"${String(value ?? "").replace(/"/g, '""')}"`;

//     const periodHeading =
//       selectedPeriod === "hourly"
//         ? "Time"
//         : selectedPeriod === "daily"
//           ? "Date / Time"
//           : "Date";

//     const buildCsvFlowSection = (flow, equipments) => {
//       const equipmentKeys = equipments.map((equipment) => equipment.key);

//       const flowRows = scopedSourceData
//         .filter((row) => equipmentKeys.includes(row.equipment))
//         .filter(matchesSelectedPeriod);

//       if (!flowRows.length) return [];

//       const exportedRows = buildFlowWiseExportRows(
//         flowRows,
//         equipments,
//         selectedPeriod,
//       );

//       if (!exportedRows.length) return [];

//       // Collect only the monitoring fields that belong to this flow's
//       // equipment. No hard-coded kWh/kVAh/Amps columns.
//       const featureColumnNames = [];

//       equipments.forEach((equipment) => {
//         getFlowFeatureColumns(equipment).forEach(([heading]) => {
//           if (!featureColumnNames.includes(heading)) {
//             featureColumnNames.push(heading);
//           }
//         });
//       });

//       const section = [];

//       // Flow name
//       section.push([flow.label]);

//       // Equipment + the exact MainOverview monitoring fields
//       section.push([
//         "Equipment",
//         periodHeading,
//         ...featureColumnNames,
//       ]);

//       exportedRows.forEach(({ equipment, periodValue, sourceRow }) => {
//         const equipmentColumns = new Map(
//           getFlowFeatureColumns(equipment).map(([heading, accessor]) => [
//             heading,
//             accessor,
//           ]),
//         );

//         section.push([
//           equipment.label,
//           periodValue,
//           ...featureColumnNames.map((heading) => {
//             const accessor = equipmentColumns.get(heading);
//             return accessor ? accessor(sourceRow) ?? "" : "";
//           }),
//         ]);
//       });

//       return section;
//     };

//     let csvRows = [];
//     let fileLabel = "";

//     // ALL -> flow name, equipment, exact feature data, one blank row,
//     // next flow, and so on.
//     if (selectedMainFlow === "all" && isAllInnerEquipment) {
//       MAIN_FLOW_OPTIONS.forEach((flow) => {
//         const equipments = getInnerEquipmentForFlow(flow.key);

//         const flowSections = [];

//         equipments.forEach((equipment) => {
//           const equipmentRows = scopedSourceData
//             .filter((row) => row.equipment === equipment.key)
//             .filter(matchesSelectedPeriod);

//           if (!equipmentRows.length) return;

//           const exportedRows = buildFlowWiseExportRows(
//             equipmentRows,
//             [equipment],
//             selectedPeriod,
//           );

//           if (!exportedRows.length) return;

//           const featureColumns = getFlowFeatureColumns(equipment);

//           // Equipment name first, then only that equipment's monitoring fields.
//           flowSections.push([equipment.label]);
//           flowSections.push([
//             periodHeading,
//             ...featureColumns.map(([heading]) => heading),
//           ]);

//           exportedRows.forEach(({ periodValue, sourceRow }) => {
//             flowSections.push([
//               periodValue,
//               ...featureColumns.map(([, accessor]) =>
//                 accessor(sourceRow) ?? "",
//               ),
//             ]);
//           });

//           // One blank row after every equipment section.
//           flowSections.push([]);
//         });

//         if (!flowSections.length) return;

//         // One blank row before each new flow except the first.
//         if (csvRows.length) {
//           csvRows.push([]);
//         }

//         // Flow name clearly separated from its equipment sections.
//         csvRows.push([flow.label]);
//         csvRows.push([]);

//         // Remove only the final equipment separator before the next flow.
//         while (
//           flowSections.length &&
//           flowSections[flowSections.length - 1].length === 0
//         ) {
//           flowSections.pop();
//         }

//         csvRows.push(...flowSections);
//       });

//       fileLabel = "All-Flows";
//     } else {
//       const flow =
//         MAIN_FLOW_OPTIONS.find((item) => item.key === selectedMainFlow) ||
//         getMainFlowForEquipment(EQUIPMENT_BY_KEY[selectedEquipment]);

//       if (!flow) return;

//       const equipments = isAllInnerEquipment
//         ? innerEquipmentOptions
//         : [
//             EQUIPMENT_BY_KEY[selectedEquipment] ||
//               innerEquipmentOptions[0],
//           ].filter(Boolean);

//       csvRows = buildCsvFlowSection(flow, equipments);
//       fileLabel = isAllInnerEquipment
//         ? flow.label
//         : selectedEquipmentLabel;
//     }

//     if (!csvRows.length) return;

//     const csvLines = csvRows.map((row) =>
//       row.map(escapeCsv).join(","),
//     );

//     const blob = new Blob(["\uFEFF" + csvLines.join("\r\n")], {
//       type: "text/csv;charset=utf-8;",
//     });

//     const safeName = String(fileLabel || "bms")
//       .replace(/[^a-zA-Z0-9-_]+/g, "-")
//       .replace(/^-+|-+$/g, "");

//     const url = URL.createObjectURL(blob);
//     const anchor = document.createElement("a");
//     anchor.href = url;
//     anchor.download = `${safeName || "bms"}-${selectedPeriod}-monitoring.csv`;

//     document.body.appendChild(anchor);
//     anchor.click();
//     document.body.removeChild(anchor);
//     URL.revokeObjectURL(url);
//   };

//   const downloadJson = () => {
//     if (!canDownloadReports) return;
//     const report = {
//       generatedAt: new Date().toISOString(),
//       filters: {
//         equipment: selectedEquipment,
//         equipmentLabel: selectedEquipmentLabel,
//         flowGroup: isAllInnerEquipment
//           ? selectedMainFlowLabel
//           : EQUIPMENT_BY_KEY[selectedEquipment]?.group || "",
//         period: selectedPeriod,
//         selectedDate,
//         selectedMonth,
//         fromTime,
//         toTime,
//         customStart,
//         customEnd,
//       },
//       summary,
//       readings: filteredData,
//     };

//     triggerDownload(
//       new Blob([JSON.stringify(report, null, 2)], {
//         type: "application/json",
//       }),
//       `power-analytics-${selectedEquipment}-${selectedPeriod}.json`,
//     );
//   };


//   const downloadExcel = () => {
//     if (!canDownloadReports) return;

//     const matchesSelectedPeriod = (row) => {
//       const rowDate = row.timestamp.slice(0, 10);
//       const rowTime = row.timestamp.slice(11, 16);

//       if (selectedPeriod === "hourly") {
//         return (
//           rowDate === selectedDate &&
//           rowTime >= fromTime &&
//           rowTime <= toTime
//         );
//       }

//       if (selectedPeriod === "daily") {
//         return rowDate === selectedDate;
//       }

//       if (selectedPeriod === "weekly") {
//         const start = startOfWeekMonday(selectedDate);
//         const end = endOfWeekSunday(start);
//         const current = new Date(`${rowDate}T00:00:00`);
//         return current >= start && current <= end;
//       }

//       if (selectedPeriod === "monthly") {
//         return rowDate.slice(0, 7) === selectedMonth;
//       }

//       if (selectedPeriod === "custom") {
//         if (customStart && new Date(row.timestamp) < new Date(customStart)) {
//           return false;
//         }

//         if (customEnd && new Date(row.timestamp) > new Date(customEnd)) {
//           return false;
//         }

//         return true;
//       }

//       return true;
//     };

//     const reportRange =
//       selectedPeriod === "monthly"
//         ? selectedMonth
//         : selectedPeriod === "weekly"
//           ? `${formatDateKey(startOfWeekMonday(selectedDate))} to ${formatDateKey(
//               endOfWeekSunday(startOfWeekMonday(selectedDate)),
//             )}`
//           : selectedPeriod === "custom"
//             ? `${customStart || "Start"} to ${customEnd || "End"}`
//             : selectedDate;

//     const workbook = XLSX.utils.book_new();

//     const addFlowSheet = (flow, equipments) => {
//       const equipmentKeys = equipments.map((equipment) => equipment.key);
//       const flowRows = scopedSourceData
//         .filter((row) => equipmentKeys.includes(row.equipment))
//         .filter(matchesSelectedPeriod);

//       if (!flowRows.length) return;

//       const exportedRows = buildFlowWiseExportRows(
//         flowRows,
//         equipments,
//         selectedPeriod,
//       );

//       if (!exportedRows.length) return;

//       const featureColumnNames = [];
//       const featureColumnMap = new Map();

//       equipments.forEach((equipment) => {
//         getFlowFeatureColumns(equipment).forEach(([heading, accessor]) => {
//           if (!featureColumnMap.has(heading)) {
//             featureColumnMap.set(heading, accessor);
//             featureColumnNames.push(heading);
//           }
//         });
//       });

//       const periodHeading =
//         selectedPeriod === "hourly"
//           ? "Time"
//           : selectedPeriod === "daily"
//             ? "Date / Time"
//             : "Date";

//       const metadata = [
//         ["Flow", flow.label],
//         ["Report", selectedPeriod],
//         ["Date / Range", reportRange],
//         ["Equipment Count", equipments.length],
//         [],
//       ];

//       const header = [
//         "Equipment",
//         periodHeading,
//         ...featureColumnNames,
//       ];

//       const body = exportedRows.map(({ equipment, periodValue, sourceRow }) => {
//         const equipmentColumns = new Map(
//           getFlowFeatureColumns(equipment).map(([heading, accessor]) => [
//             heading,
//             accessor,
//           ]),
//         );

//         return [
//           equipment.label,
//           periodValue,
//           ...featureColumnNames.map((heading) => {
//             const accessor = equipmentColumns.get(heading);
//             return accessor ? accessor(sourceRow) ?? "" : "";
//           }),
//         ];
//       });

//       const worksheet = XLSX.utils.aoa_to_sheet([
//         ...metadata,
//         header,
//         ...body,
//       ]);

//       worksheet["!freeze"] = { xSplit: 0, ySplit: 6 };
//       worksheet["!autofilter"] = {
//         ref: `A6:${XLSX.utils.encode_col(header.length - 1)}${body.length + 6}`,
//       };

//       worksheet["!cols"] = header.map((heading, index) => ({
//         wch:
//           index === 0
//             ? 30
//             : index === 1
//               ? 18
//               : Math.max(12, Math.min(22, String(heading).length + 4)),
//       }));

//       const safeSheetName = flow.label
//         .replace(/[\\/?*[\]:]/g, "-")
//         .slice(0, 31);

//       XLSX.utils.book_append_sheet(
//         workbook,
//         worksheet,
//         safeSheetName || "Flow",
//       );
//     };

//     if (selectedMainFlow === "all" && isAllInnerEquipment) {
//       // ALL DATA DOWNLOAD:
//       // Flow -> equipment -> that equipment's monitoring fields.
//       // A blank row separates every equipment, so data never appears
//       // as one continuous mixed table.
//       const allRows = [];

//       MAIN_FLOW_OPTIONS.forEach((flow) => {
//         const equipments = getInnerEquipmentForFlow(flow.key);
//         const flowRows = [];

//         equipments.forEach((equipment) => {
//           const equipmentRows = scopedSourceData
//             .filter((row) => row.equipment === equipment.key)
//             .filter(matchesSelectedPeriod);

//           if (!equipmentRows.length) return;

//           const exportedRows = buildFlowWiseExportRows(
//             equipmentRows,
//             [equipment],
//             selectedPeriod,
//           );

//           if (!exportedRows.length) return;

//           const featureColumns = getFlowFeatureColumns(equipment);

//           const periodHeading =
//             selectedPeriod === "hourly"
//               ? "Time"
//               : selectedPeriod === "daily"
//                 ? "Date / Time"
//                 : "Date";

//           // Equipment title
//           flowRows.push([equipment.label]);

//           // Only this equipment's actual monitoring features
//           flowRows.push([
//             periodHeading,
//             ...featureColumns.map(([heading]) => heading),
//           ]);

//           exportedRows.forEach(({ periodValue, sourceRow }) => {
//             flowRows.push([
//               periodValue,
//               ...featureColumns.map(([, accessor]) =>
//                 accessor(sourceRow) ?? "",
//               ),
//             ]);
//           });

//           // Exactly one blank row between equipment sections.
//           flowRows.push([]);
//         });

//         while (
//           flowRows.length &&
//           flowRows[flowRows.length - 1].length === 0
//         ) {
//           flowRows.pop();
//         }

//         if (!flowRows.length) return;

//         // Exactly one blank row between flows.
//         if (allRows.length) {
//           allRows.push([]);
//         }

//         allRows.push([flow.label]);
//         allRows.push([]);
//         allRows.push(...flowRows);
//       });

//       if (!allRows.length) return;

//       const worksheet = XLSX.utils.aoa_to_sheet(allRows);

//       const maxColumnCount = allRows.reduce(
//         (max, row) => Math.max(max, row.length),
//         0,
//       );

//       worksheet["!cols"] = Array.from(
//         { length: Math.max(2, maxColumnCount) },
//         (_, index) => ({
//           wch: index === 0 ? 30 : 20,
//         }),
//       );

//       XLSX.utils.book_append_sheet(
//         workbook,
//         worksheet,
//         "All Flows",
//       );
//     } else {
//       const flow =
//         MAIN_FLOW_OPTIONS.find((item) => item.key === selectedMainFlow) ||
//         getMainFlowForEquipment(EQUIPMENT_BY_KEY[selectedEquipment]);

//       if (!flow) return;

//       const equipments = isAllInnerEquipment
//         ? innerEquipmentOptions
//         : [
//             EQUIPMENT_BY_KEY[selectedEquipment] ||
//               innerEquipmentOptions[0],
//           ].filter(Boolean);

//       addFlowSheet(flow, equipments);
//     }

//     if (!workbook.SheetNames.length) return;

//     const fileLabel =
//       selectedMainFlow === "all" && isAllInnerEquipment
//         ? "All-Flows-One-Sheet"
//         : selectedMainFlowLabel.replace(/[^a-zA-Z0-9-_]+/g, "-");

//     XLSX.writeFile(
//       workbook,
//       `${fileLabel || "BMS"}-${selectedPeriod}-flow-wise-monitoring.xlsx`,
//     );
//   };

//   const resetFilters = () => {
//     setSelectedMainFlow("source");
//     setSelectedEquipment(
//       getInnerEquipmentForFlow("source")[0]?.key || "source",
//     );
//     setSelectedPeriod("daily");
//     setSelectedDate(formatDateKey(new Date()));
//     setSelectedMonth(getCurrentMonth());
//     setFromTime("00:00");
//     setToTime("23:59");
//     setCustomStart("");
//     setCustomEnd("");
//   };

//   if (!currentUser) {
//     return (
//       <main className="flex min-h-screen items-center justify-center bg-[#EEF3F8] px-6 py-10">
//         <section className="w-full max-w-md border-2 border-red-400 bg-[#081F5C] p-8 text-center text-white">
//           <h1 className="text-2xl font-black">
//             User Session Required
//           </h1>

//           <p className="mt-3 text-sm leading-6 text-blue-200">
//             Please sign in with an active User account to open the analytical overview.
//           </p>

//           <button
//             type="button"
//             onClick={() => {
//               tempApi.logout();
//               window.location.href = "/auth";
//             }}
//             className="mt-6 inline-flex items-center justify-center border border-cyan-400 bg-[#004AAD] px-6 py-2.5 text-sm font-black text-white hover:bg-[#003B8A]"
//           >
//             Go to Login
//           </button>
//         </section>
//       </main>
//     );
//   }

//   if (!hasOverviewDataScope) {
//     return (
//       <main className="flex min-h-screen items-center justify-center bg-[#EEF3F8] px-6 py-10">
//         <section className="w-full max-w-lg border-2 border-amber-400 bg-[#081F5C] p-8 text-center text-white">
//           <h1 className="text-2xl font-black">No access scope assigned</h1>
//           <p className="mt-3 text-sm leading-6 text-blue-200">
//             No Floor or Zone access has been assigned.
//           </p>
//           <Link
//             to="/dashboard"
//             className="mt-6 inline-flex items-center justify-center border border-cyan-400 bg-[#004AAD] px-6 py-2.5 text-sm font-black text-white hover:bg-[#003B8A]"
//           >
//             Back to Dashboard
//           </Link>
//         </section>
//       </main>
//     );
//   }

//   return (
//     <div className="flex min-h-[100dvh] w-full min-w-0 flex-col overflow-x-hidden bg-[radial-gradient(circle_at_50%_0%,rgba(0,174,239,0.07),transparent_28%),linear-gradient(180deg,#F7FAFD_0%,#EEF5FA_100%)] text-[#06224F]">
//       <header className="sticky top-0 z-[1000] shrink-0 border-b-4 border-[#004AAD] bg-[#081F5C] px-3 py-2.5 text-white shadow-[0_8px_30px_rgba(3,23,65,0.20)] sm:px-4">
//         <div className="flex w-full min-w-0 flex-col gap-2.5 xl:flex-row xl:items-center xl:justify-between">
//           <Link to="/dashboard" className="flex min-w-0 items-center no-underline">
//             <div className="min-w-0">
//               <h1 className="truncate text-[clamp(18px,2vw,26px)] font-semibold uppercase leading-none tracking-[0.18em] text-white">
//                 ARCOT
//                 <span className="ml-2 text-[#67E8F9]">IIoT 1.0</span>
//               </h1>

//               <span className="mt-1 hidden text-[9px] font-medium uppercase tracking-[0.35em] text-blue-300 sm:block">
//                 Industrial Internet of Things
//               </span>
//             </div>

//             <div className="ml-5 hidden h-[54px] border-l border-[#004AAD] sm:block" />

//             <img
//               src={prestigeLogo}
//               alt="Prestige Group"
//               className="ml-5 hidden h-[52px] w-[100px] object-contain sm:block"
//             />
//           </Link>

//           <div className="grid w-full min-w-0 grid-cols-2 gap-2 sm:grid-cols-4 xl:flex xl:w-auto xl:flex-wrap xl:items-center">
//             <Link
//               to="/dashboard"
//               replace
//               className="flex h-9 w-full items-center justify-center border border-cyan-400 bg-[#004AAD] px-4 text-[10px] font-black uppercase tracking-[0.15em] text-white transition hover:bg-[#0058D6] sm:w-auto"
//             >
//               Back
//             </Link>

//             <div className="hidden border border-[#004AAD] bg-[#05143C] px-3 py-1.5 lg:block">
//               <p className="max-w-[190px] truncate text-[9px] font-bold text-cyan-200">
//                 {currentUser.name}
//               </p>

//               <p className="max-w-[190px] truncate text-[7px] uppercase tracking-[0.08em] text-blue-300">
//                 {currentUser.designation || "USER"} ·{" "}
//                 {currentUser.companyName || "Assigned Company"}
//               </p>
//             </div>

//             <div className="hidden items-center gap-2 border border-[#004AAD] bg-[#05143C] px-3 py-1.5 md:flex">
//               <span className="h-2 w-2 bg-emerald-400" />

//               <span className="text-[10px] font-bold tracking-[0.15em] text-white">
//                 BLE Connected
//               </span>
//             </div>

//             <button
//               type="button"
//               onClick={() => {
//                 tempApi.logout();
//                 window.location.href = "/auth";
//               }}
//               className="h-9 w-full border border-red-400 bg-red-600 px-4 text-[10px] font-black uppercase tracking-[0.15em] text-white transition hover:bg-red-700 sm:w-auto"
//             >
//               Logout
//             </button>
//           </div>
//         </div>
//       </header>

//       <style>{`
//         .overview-main-grid {
//           align-content: start;
//         }

//         @media (min-width: 1024px) and (max-width: 1535px) {
//           .overview-main-grid {
//             gap: 10px;
//           }
//         }

//         @media (min-width: 1024px) and (max-height: 820px) {
//           .overview-main-grid {
//             padding-top: 10px;
//             padding-bottom: 14px;
//           }
//         }

//         @media (max-width: 639px) {
//           .overview-main-grid {
//             padding-left: 10px;
//             padding-right: 10px;
//           }
//         }

//         @media print {
//           header,
//           button,
//           select,
//           input {
//             display: none !important;
//           }

//           body {
//             background: white !important;
//           }

//           main {
//             max-width: none !important;
//             padding: 0 !important;
//           }

//           .print-safe {
//             box-shadow: none !important;
//             break-inside: avoid;
//           }
//         }
//       `}</style>

//       <main className="overview-main-grid mx-auto grid w-full min-w-0 max-w-[1720px] grid-cols-1 gap-3 overflow-x-hidden px-3 py-3 sm:px-4 md:px-5 lg:px-6 2xl:px-8">
//         <section className="grid min-w-0 grid-cols-1 gap-3 xl:grid-cols-12">
//           <div className="relative col-span-12 min-w-0 overflow-hidden rounded-[15px] border border-[#0A326B] bg-[linear-gradient(135deg,#041A3E_0%,#073066_56%,#0A5E91_100%)] px-4 py-3.5 text-white shadow-[0_18px_42px_rgba(8,31,92,0.22)] xl:col-span-4">
//             <div className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full border border-white/10 bg-white/[0.04]" />
//             <div className="pointer-events-none absolute -bottom-24 left-16 h-52 w-52 rounded-full bg-[#17A8DB]/15 blur-3xl" />

//      <div className="relative flex min-h-[132px] min-w-0 items-center justify-between gap-4 sm:min-h-[148px] xl:h-full">
//   <div>
//     <h2 className="text-[22px] font-bold leading-tight tracking-[-0.03em] text-white">
//       Operational Analytics
//       <span className="mt-1 block text-[18px] font-semibold text-[#5DD9FF]">
//         Monitoring Workspace
//       </span>
//     </h2>

//     <p className="mt-3 max-w-[320px] truncate text-[9px] font-semibold uppercase tracking-[0.08em] text-blue-200">
//       {currentUser.companyName || "Assigned Company"} ·{" "}
//       {currentUser.accessType || "BUILDING"}:{" "}
//       {currentUser.accessName || "Assigned Access"}
//     </p>
//   </div>

//   <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] border border-white/15 bg-white/[0.08] text-[#5DD9FF] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
//     <BarChart3 size={24} />
//   </div>
// </div>
//           </div>

//        <Card className="print-safe col-span-12 flex min-h-0 min-w-0 flex-col overflow-hidden p-3.5 xl:col-span-8">
//   <div className="flex shrink-0 min-w-0 flex-col gap-3 border-b border-[#E3ECF5] pb-2.5 xl:flex-row xl:items-center xl:justify-between">
//     <div className="flex items-center gap-3.5">
//       <div className="flex h-11 w-11 items-center justify-center rounded-[12px] border border-[#D6E4F2] bg-[#EDF5FA] text-[#1B73C9]">
//         <Gauge size={21} strokeWidth={2.2} />
//       </div>

//       <div>
//         <h3 className="text-[15px] font-bold text-[#06224F]">
//           Analysis Controls
//         </h3>

//         <p className="mt-1 text-[10px] leading-relaxed text-[#7D91A7]">
//           Select the equipment and reporting window.
//         </p>
//       </div>
//     </div>

//     <div className="grid w-full min-w-0 grid-cols-2 gap-2 sm:grid-cols-4 2xl:w-auto 2xl:shrink-0">
//       <button
//         type="button"
//         onClick={downloadCsv}
//         disabled={!canDownloadReports}
//         title={
//           canDownloadReports
//             ? "Download CSV report"
//             : "Download permission is not assigned"
//         }
//         className={`inline-flex h-10 min-w-0 items-center justify-center gap-2 whitespace-nowrap rounded-[10px] px-3 text-[9px] font-bold uppercase tracking-[0.1em] transition ${
//           canDownloadReports
//             ? "bg-[#1B73C9] text-white shadow-[0_8px_18px_rgba(37,99,235,0.2)] hover:bg-[#155FA8]"
//             : "cursor-not-allowed bg-slate-200 text-slate-400"
//         }`}
//       >
//         <Download size={15} />
//         CSV
//       </button>

//       <button
//         type="button"
//         onClick={downloadExcel}
//         disabled={!canDownloadReports}
//         title={
//           canDownloadReports
//             ? "Download flow-wise Excel workbook with equipment-specific monitoring features"
//             : "Download permission is not assigned"
//         }
//         className={`inline-flex h-10 min-w-0 items-center justify-center gap-2 whitespace-nowrap rounded-[10px] border px-3 text-[9px] font-bold uppercase tracking-[0.1em] transition ${
//           canDownloadReports
//             ? "border-[#BEE8D4] bg-[#ECFDF5] text-[#15805F] hover:border-[#16A34A] hover:bg-[#DFF8EA]"
//             : "cursor-not-allowed border-slate-300 bg-slate-100 text-slate-400"
//         }`}
//       >
//         <Download size={15} />
//         Realtime Excel
//       </button>

//       <button
//         type="button"
//         onClick={downloadJson}
//         disabled={!canDownloadReports}
//         title={
//           canDownloadReports
//             ? "Download JSON report"
//             : "Download permission is not assigned"
//         }
//         className={`inline-flex h-10 min-w-0 items-center justify-center gap-2 whitespace-nowrap rounded-[10px] border px-3 text-[9px] font-bold uppercase tracking-[0.1em] transition ${
//           canDownloadReports
//             ? "border-[#CCDCEB] bg-white text-[#416483] hover:border-[#1B73C9] hover:text-[#1B73C9]"
//             : "cursor-not-allowed border-slate-300 bg-slate-100 text-slate-400"
//         }`}
//       >
//         <FileJson size={15} />
//         JSON
//       </button>

//       <button
//         type="button"
//         onClick={() => {
//           if (canDownloadReports) {
//             window.print();
//           }
//         }}
//         disabled={!canDownloadReports}
//         title={
//           canDownloadReports
//             ? "Print analytics"
//             : "Download permission is not assigned"
//         }
//         className={`hidden h-10 w-10 items-center justify-center rounded-[10px] border transition sm:flex ${
//           canDownloadReports
//             ? "border-[#CCDCEB] bg-white text-[#657B92] hover:border-[#06224F] hover:text-[#06224F]"
//             : "cursor-not-allowed border-slate-300 bg-slate-100 text-slate-400"
//         }`}
//         aria-label="Print analytics"
//       >
//         <Printer size={16} />
//       </button>
//     </div>
//   </div>

//   <div className="mt-3 grid min-w-0 grid-cols-1 items-end gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7">
//     <label className="flex w-full min-w-0 max-w-full flex-col gap-1.5">
//       <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#8192A7]">
//         Main Equipment
//       </span>

//       <select
//         aria-label="Select main equipment"
//         value={selectedMainFlow}
//         onChange={(event) => {
//           const nextFlow = event.target.value;
//           const nextOptions = getInnerEquipmentForFlow(nextFlow);

//           setSelectedMainFlow(nextFlow);
//           setSelectedEquipment(
//             nextFlow === "all"
//               ? "all"
//               : nextOptions[0]?.key || nextFlow,
//           );
//         }}
//         className="h-10 w-full min-w-0 max-w-full truncate rounded-[9px] border border-[#C6D8E9] bg-[#FAFCFE] px-3 text-[11px] font-semibold text-[#06224F] outline-none transition focus:border-[#1B73C9] focus:ring-2 focus:ring-[#1B73C9]/10"
//       >
//         {MAIN_FLOW_OPTIONS.map((flow) => (
//           <option key={flow.key} value={flow.key}>
//             {flow.label}
//           </option>
//         ))}
//         <option value="all">All</option>
//       </select>
//     </label>

//     <label className="flex w-full min-w-0 max-w-full flex-col gap-1.5">
//       <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#8192A7]">
//         Inner Equipment
//       </span>

//       <select
//         aria-label="Select inner equipment"
//         value={selectedEquipment}
//         onChange={(event) => setSelectedEquipment(event.target.value)}
//         className="h-10 w-full min-w-0 max-w-full truncate rounded-[9px] border border-[#C6D8E9] bg-[#FAFCFE] px-3 text-[11px] font-semibold text-[#06224F] outline-none transition focus:border-[#1B73C9] focus:ring-2 focus:ring-[#1B73C9]/10"
//       >
//         {innerEquipmentOptions.map((equipment) => (
//           <option key={equipment.key} value={equipment.key}>
//             {equipment.label}
//           </option>
//         ))}
//         <option value="all">All</option>
//       </select>
//     </label>

//     <label className="flex w-full min-w-0 max-w-full flex-col gap-1.5">
//       <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#8192A7]">
//         Period
//       </span>

//       <select
//         aria-label="Select reporting period"
//         value={selectedPeriod}
//         onChange={(event) => setSelectedPeriod(event.target.value)}
//         className="h-10 w-full min-w-0 max-w-full truncate rounded-[9px] border border-[#C6D8E9] bg-[#FAFCFE] px-3 text-[11px] font-semibold text-[#06224F] outline-none transition focus:border-[#1B73C9] focus:ring-2 focus:ring-[#1B73C9]/10"
//       >
//         <option value="hourly">Hourly</option>
//         <option value="daily">Daily</option>
//         <option value="weekly">Weekly</option>
//         <option value="monthly">Monthly</option>
//         <option value="custom">Custom Range</option>
//       </select>
//     </label>

//     {(selectedPeriod === "hourly" || selectedPeriod === "daily" || selectedPeriod === "weekly") && (
//       <label className="flex w-full min-w-0 max-w-full flex-col gap-1.5">
//         <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#8192A7]">
//           Date
//         </span>

//         <input
//           type="date"
//           value={selectedDate}
//           onChange={(event) => setSelectedDate(event.target.value)}
//           className="h-10 w-full min-w-0 max-w-full truncate rounded-[9px] border border-[#C6D8E9] bg-[#FAFCFE] px-3 text-[11px] font-semibold text-[#06224F] outline-none transition focus:border-[#1B73C9] focus:ring-2 focus:ring-[#1B73C9]/10"
//         />
//       </label>
//     )}

//     {selectedPeriod === "monthly" && (
//       <label className="flex w-full min-w-0 max-w-full flex-col gap-1.5">
//         <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#8192A7]">
//           Month
//         </span>

//         <input
//           type="month"
//           value={selectedMonth}
//           onChange={(event) => setSelectedMonth(event.target.value)}
//           className="h-10 w-full min-w-0 max-w-full truncate rounded-[9px] border border-[#C6D8E9] bg-[#FAFCFE] px-3 text-[11px] font-semibold text-[#06224F] outline-none transition focus:border-[#1B73C9] focus:ring-2 focus:ring-[#1B73C9]/10"
//         />
//       </label>
//     )}

//     {(selectedPeriod === "hourly" || selectedPeriod === "daily") && (
//       <>
//         <label className="flex w-full min-w-0 max-w-full flex-col gap-1.5">
//           <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#8192A7]">
//             From
//           </span>

//           <input
//             type="time"
//             value={fromTime}
//             onChange={(event) => setFromTime(event.target.value)}
//             className="h-10 w-full min-w-0 max-w-full truncate rounded-[9px] border border-[#C6D8E9] bg-[#FAFCFE] px-3 text-[11px] font-semibold text-[#06224F] outline-none transition focus:border-[#1B73C9] focus:ring-2 focus:ring-[#1B73C9]/10"
//           />
//         </label>

//         <label className="flex w-full min-w-0 max-w-full flex-col gap-1.5">
//           <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#8192A7]">
//             To
//           </span>

//           <input
//             type="time"
//             value={toTime}
//             onChange={(event) => setToTime(event.target.value)}
//             className="h-10 w-full min-w-0 max-w-full truncate rounded-[9px] border border-[#C6D8E9] bg-[#FAFCFE] px-3 text-[11px] font-semibold text-[#06224F] outline-none transition focus:border-[#1B73C9] focus:ring-2 focus:ring-[#1B73C9]/10"
//           />
//         </label>
//       </>
//     )}

//     {selectedPeriod === "custom" && (
//       <>
//         <label className="flex min-w-0 flex-col gap-1.5 md:col-span-2">
//           <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#8192A7]">
//             Range Start
//           </span>

//           <input
//             type="datetime-local"
//             value={customStart}
//             onChange={(event) => setCustomStart(event.target.value)}
//             className="h-10 w-full min-w-0 max-w-full truncate rounded-[9px] border border-[#C6D8E9] bg-[#FAFCFE] px-3 text-[11px] font-semibold text-[#06224F] outline-none transition focus:border-[#1B73C9] focus:ring-2 focus:ring-[#1B73C9]/10"
//           />
//         </label>

//         <label className="flex min-w-0 flex-col gap-1.5 md:col-span-2">
//           <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#8192A7]">
//             Range End
//           </span>

//           <input
//             type="datetime-local"
//             value={customEnd}
//             onChange={(event) => setCustomEnd(event.target.value)}
//             className="h-10 w-full min-w-0 max-w-full truncate rounded-[9px] border border-[#C6D8E9] bg-[#FAFCFE] px-3 text-[11px] font-semibold text-[#06224F] outline-none transition focus:border-[#1B73C9] focus:ring-2 focus:ring-[#1B73C9]/10"
//           />
//         </label>
//       </>
//     )}

//     <button
//       type="button"
//       onClick={resetFilters}
//       className="mt-auto inline-flex h-10 w-full min-w-0 items-center justify-center gap-2 whitespace-nowrap rounded-[9px] border border-[#C6D8E9] bg-[#F7FAFD] px-3 text-[9px] font-bold uppercase tracking-[0.1em] text-[#657B92] transition hover:border-[#1B73C9] hover:bg-white hover:text-[#1B73C9]"
//     >
//       <RefreshCw size={15} />
//       Reset
//     </button>
//   </div>
// </Card>
//         </section>

//         <section className="grid min-w-0 grid-cols-1 gap-2.5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
//           {selectedEquipment !== "all" && selectedMonitoringCards.length ? (
//             <>
//               {selectedMonitoringCards.slice(0, 5).map((item, index) => (
//                 <MetricCard
//                   key={item.label}
//                   label={item.label}
//                   value={item.value ?? "-"}
//                   tone={
//                     index === 0
//                       ? "blue"
//                       : index === 1
//                         ? "amber"
//                         : index === 2
//                           ? "cyan"
//                           : index === 3
//                             ? "green"
//                             : "blue"
//                   }
//                   icon={
//                     item.label.includes("Temp")
//                       ? Activity
//                       : item.label.includes("Load") ||
//                           item.label.includes("Level") ||
//                           item.label.includes("Battery")
//                         ? Gauge
//                         : item.label.includes("Voltage")
//                           ? Zap
//                           : item.label.includes("Health") ||
//                               item.label.includes("Relay")
//                             ? ShieldCheck
//                             : BarChart3
//                   }
//                   trend={
//                     index === 0 && selectedMonitoringStatus
//                       ? selectedMonitoringStatus
//                       : undefined
//                   }
//                 />
//               ))}

//               {Array.from({
//                 length: Math.max(
//                   0,
//                   5 - selectedMonitoringCards.slice(0, 5).length,
//                 ),
//               }).map((_, index) => (
//                 <MetricCard
//                   key={`empty-monitor-${index}`}
//                   label="Monitoring"
//                   value="-"
//                   tone="blue"
//                   icon={Activity}
//                 />
//               ))}
//             </>
//           ) : (
//             <>
//               <MetricCard
//                 label="Consumed Energy"
//                 value={summary.totalEnergy.toLocaleString(undefined, {
//                   maximumFractionDigits: 0,
//                 })}
//                 unit="kWh"
//                 tone="blue"
//                 icon={Zap}
//                 trend="Live"
//               />

//               <MetricCard
//                 label="Peak Load"
//                 value={summary.peakLoad.toLocaleString(undefined, {
//                   maximumFractionDigits: 0,
//                 })}
//                 unit="kW"
//                 tone="amber"
//                 icon={TrendingUp}
//               />

//               <MetricCard
//                 label="Average Load"
//                 value={summary.averageLoad.toLocaleString(undefined, {
//                   maximumFractionDigits: 0,
//                 })}
//                 unit="kW"
//                 tone="cyan"
//                 icon={Activity}
//               />

//               <MetricCard
//                 label="Distribution Loss"
//                 value={summary.totalLoss.toLocaleString(undefined, {
//                   maximumFractionDigits: 0,
//                 })}
//                 unit="kW"
//                 tone="red"
//                 icon={ArrowDownToLine}
//               />

//               <MetricCard
//                 label="Efficiency"
//                 value={`${summary.efficiency.toFixed(1)}%`}
//                 tone="green"
//                 icon={ShieldCheck}
//               />
//             </>
//           )}
//         </section>

//         <div className="flex min-h-[42px] flex-col gap-2 rounded-[11px] border border-[#D3E2EF] bg-white px-1.5 py-1.5 shadow-[0_8px_22px_rgba(8,31,92,0.06)] sm:flex-row sm:items-center sm:justify-between">
//           <div className="grid grid-cols-2 gap-1 sm:flex sm:items-center">
//             <button
//               type="button"
//               onClick={() => setActiveWorkspace("analytics")}
//               className={`inline-flex items-center gap-2 rounded-[9px] px-4 py-2 text-[8px] font-bold uppercase tracking-[0.1em] transition ${
//                 activeWorkspace === "analytics"
//                   ? "bg-[#06224F] text-white shadow-[0_8px_18px_rgba(8,31,92,0.18)]"
//                   : "text-[#687F99] hover:bg-[#EDF5FA] hover:text-[#06224F]"
//               }`}
//             >
//               <BarChart3 size={13} />
//               Analytics
//             </button>

//             <button
//               type="button"
//               onClick={() => setActiveWorkspace("readings")}
//               className={`inline-flex items-center gap-2 rounded-[9px] px-4 py-2 text-[8px] font-bold uppercase tracking-[0.1em] transition ${
//                 activeWorkspace === "readings"
//                   ? "bg-[#06224F] text-white shadow-[0_8px_18px_rgba(8,31,92,0.18)]"
//                   : "text-[#687F99] hover:bg-[#EDF5FA] hover:text-[#06224F]"
//               }`}
//             >
//               <Layers3 size={13} />
//               Detailed Readings
//             </button>
//           </div>

//           <div className="hidden items-center gap-2 pr-2 md:flex">
//             <span className="h-2 w-2 rounded-full bg-[#16A34A] shadow-[0_0_0_4px_rgba(22,163,74,0.10)]" />
//             <span className="text-[8px] font-bold uppercase tracking-[0.1em] text-[#15805F]">
//               {filteredData.length.toLocaleString()} records loaded
//             </span>
//           </div>
//         </div>

//         {activeWorkspace === "analytics" ? (
//           canViewReports ? (
//             <section className="grid min-w-0 grid-cols-1 gap-2.5 xl:grid-cols-12">
//             <Card className="print-safe flex min-h-[260px] min-w-0 flex-col overflow-hidden p-3.5 xl:col-span-8">
//               <SectionTitle
//                 title={`${selectedEquipmentLabel} Load Trend`}
//                 subtitle="Consumption trend across the selected period."
//                 icon={TrendingUp}
//               />

//               <div className="flex min-h-[220px] flex-1 items-stretch rounded-[12px] border border-[#D8E6F2] bg-[linear-gradient(180deg,#FAFCFE_0%,#F6FAFE_100%)] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] sm:min-h-[280px] lg:min-h-0">
//                 <TrendChart rows={filteredData} />
//               </div>
//             </Card>

//             <div className="grid min-h-0 min-w-0 grid-cols-1 gap-2.5 sm:grid-cols-2 xl:col-span-4 xl:grid-cols-1">
//               <Card className="print-safe flex min-h-[180px] flex-col p-3 lg:h-full lg:min-h-0">
//                 <SectionTitle
//                   title="Electrical Quality"
//                   subtitle="Average electrical conditions for the selected data."
//                   icon={Gauge}
//                 />

//                 <div className="grid min-h-0 flex-1 grid-cols-3 items-stretch gap-2">
//                   <div className="flex min-h-0 flex-col items-center justify-center rounded-[14px] border border-[#D8E6F2] bg-[linear-gradient(180deg,#FFFFFF_0%,#F5F9FC_100%)] p-2 text-center shadow-[0_8px_18px_rgba(8,31,92,0.05)]">
//                     <p className="text-[8px] uppercase tracking-[0.1em] text-[#8192A7]">
//                       Voltage
//                     </p>
//                     <h3 className="mt-2 text-[18px] font-semibold text-[#1B73C9]">
//                       {summary.averageVoltage.toFixed(1)}
//                     </h3>
//                     <p className="mt-1 text-[8px] text-[#8192A7]">V</p>
//                   </div>

//                   <div className="flex min-h-0 flex-col items-center justify-center rounded-[14px] border border-[#D8E6F2] bg-[linear-gradient(180deg,#FFFFFF_0%,#F5F9FC_100%)] p-2 text-center shadow-[0_8px_18px_rgba(8,31,92,0.05)]">
//                     <p className="text-[8px] uppercase tracking-[0.1em] text-[#8192A7]">
//                       Current
//                     </p>
//                     <h3 className="mt-2 text-[18px] font-semibold text-[#0E86B7]">
//                       {summary.averageCurrent.toFixed(1)}
//                     </h3>
//                     <p className="mt-1 text-[8px] text-[#8192A7]">A</p>
//                   </div>

//                   <div className="flex min-h-0 flex-col items-center justify-center rounded-[14px] border border-[#D8E6F2] bg-[linear-gradient(180deg,#FFFFFF_0%,#F5F9FC_100%)] p-2 text-center shadow-[0_8px_18px_rgba(8,31,92,0.05)]">
//                     <p className="text-[8px] uppercase tracking-[0.1em] text-[#8192A7]">
//                       PF
//                     </p>
//                     <h3 className="mt-2 text-[18px] font-semibold text-[#15805F]">
//                       {summary.averagePowerFactor.toFixed(2)}
//                     </h3>
//                     <p className="mt-1 text-[8px] text-[#8192A7]">Average</p>
//                   </div>
//                 </div>
//               </Card>

//               <Card className="print-safe flex min-h-[180px] flex-col p-3 lg:h-full lg:min-h-0">
//                 <SectionTitle
//                   title="Hourly Consumption"
//                   subtitle="Recent energy consumption blocks."
//                   icon={BarChart3}
//                 />
//                 <div className="min-h-0 flex-1 overflow-hidden px-1 pt-1">
//                   <EnergyBars rows={filteredData} />
//                 </div>
//               </Card>
//             </div>
//             </section>
//           ) : (
//             <RestrictedState
//               title="Analytics access has not been assigned."
//               message="Overview remains available. Ask an Admin to assign Analytics access for trend charts and historical analysis."
//               icon={BarChart3}
//             />
//           )
//         ) : (
//           canViewLiveReadings ? (
//             <section className="min-w-0">
//             <Card className="print-safe flex min-h-[360px] min-w-0 max-w-full flex-col overflow-hidden p-3.5">
//               <SectionTitle
//                 title="Detailed Analytical Readings"
//                 subtitle={`${filteredData.length.toLocaleString()} readings match the selected filters.`}
//                 icon={Layers3}
//               />

//               <div className="mt-3 min-w-0 max-w-full space-y-3 overflow-x-hidden lg:hidden">
//                 {filteredData.length === 0 ? (
//                   <p className="rounded-[12px] border border-[#E2EBF4] px-3 py-8 text-center text-[11px] font-semibold text-[#687F99]">
//                     No monitoring readings are available for the assigned Zones.
//                   </p>
//                 ) : (
//                   filteredData.map((row, index) => {
//                     const loss = Math.max(
//                       0,
//                       Number(row.incomingKw) - Number(row.outgoingKw),
//                     );

//                     return (
//                       <article
//                         key={`${row.timestamp}-${row.equipment}-${index}`}
//                         className="w-full rounded-[12px] border border-[#E2EBF4] bg-white p-3 text-[11px] text-[#5F738D]"
//                       >
//                         <div className="flex items-start justify-between gap-3">
//                           <div className="min-w-0">
//                             <p className="text-[8px] font-bold uppercase tracking-[0.1em] text-[#1B73C9]">
//                               {row.flowGroup}
//                             </p>
//                             <h3 className="mt-1 break-words text-sm font-black text-[#06224F]">
//                               {row.equipmentLabel}
//                             </h3>
//                             <p className="mt-1 text-[10px]">
//                               {new Date(row.timestamp).toLocaleString()}
//                             </p>
//                           </div>
//                           <span
//                             className={`inline-flex shrink-0 rounded-full border px-2.5 py-1 text-[7px] font-bold uppercase tracking-[0.08em] ${
//                               row.status === "Normal"
//                                 ? "border-[#BEE8D4] bg-[#E8F5EE] text-[#15805F]"
//                                 : "border-[#F4D3B2] bg-[#FFF5DD] text-[#B7791F]"
//                             }`}
//                           >
//                             {row.status}
//                           </span>
//                         </div>

//                         <dl className="mt-3 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
//                           {getFlowFeatureColumns(
//                             EQUIPMENT_BY_KEY[row.equipment],
//                           ).map(([label, accessor]) => {
//                             const value = accessor(row);

//                             return (
//                               <div key={label}>
//                                 <dt className="text-[8px] font-bold uppercase tracking-[0.1em] text-[#8192A7]">
//                                   {label}
//                                 </dt>
//                                 <dd className="mt-1 font-semibold text-[#06224F]">
//                                   {value ?? "-"}
//                                 </dd>
//                               </div>
//                             );
//                           })}
//                         </dl>
//                       </article>
//                     );
//                   })
//                 )}
//               </div>

//               <div className="hidden min-h-[320px] min-w-0 max-w-full flex-1 overflow-x-auto overflow-y-auto rounded-[12px] border border-[#E2EBF4] lg:block">
//                 <table className="w-max min-w-full border-collapse">
//                   <thead className="sticky top-0 z-10 bg-[#F5F9FC]/95 backdrop-blur">
//                     <tr className="border-b border-[#D8E6F2]">
//                       {[
//                         "Timestamp",
//                         "Flow",
//                         "Equipment",
//                         ...selectedFeatureColumns,
//                       ].map((heading) => (
//                         <th
//                           key={heading}
//                           className="whitespace-nowrap px-3 py-2.5 text-left text-[8px] font-bold uppercase tracking-[0.1em] text-[#8192A7]"
//                         >
//                           {heading}
//                         </th>
//                       ))}
//                     </tr>
//                   </thead>

//                   <tbody>
//                     {filteredData.length === 0 ? (
//                       <tr>
//                         <td
//                           colSpan={Math.max(
//                             3 + selectedFeatureColumns.length,
//                             3,
//                           )}
//                           className="px-3 py-8 text-center text-[11px] font-semibold text-[#687F99]"
//                         >
//                           No monitoring readings are available for the assigned Zones.
//                         </td>
//                       </tr>
//                     ) : (
//                       filteredData.map((row, index) => (
//                         <tr
//                           key={`${row.timestamp}-${row.equipment}-${index}`}
//                           className="border-b border-[#EDF2F7] transition hover:bg-[#F5F9FC] last:border-b-0"
//                         >
//                           <td className="whitespace-nowrap px-3 py-2.5 text-[9px] text-[#5F738D]">
//                             {new Date(row.timestamp).toLocaleString()}
//                           </td>

//                           <td className="whitespace-nowrap px-3 py-2.5 text-[9px] font-semibold text-[#1B73C9]">
//                             {row.flowGroup}
//                           </td>

//                           <td className="whitespace-nowrap px-3 py-2.5 text-[9px] font-semibold text-[#06224F]">
//                             {row.equipmentLabel}
//                           </td>

//                           {selectedFeatureColumns.map((heading) => (
//                             <td
//                               key={heading}
//                               className="whitespace-nowrap px-3 py-2.5 text-[9px] text-[#5F738D]"
//                             >
//                               {getFeatureValueByHeading(row, heading) || "-"}
//                             </td>
//                           ))}
//                         </tr>
//                       ))
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </Card>
//             </section>
//           ) : (
//             <RestrictedState
//               title="Live monitoring access has not been assigned."
//               message="Overview remains available. Current readings are hidden until Live Monitoring access is assigned."
//               icon={Layers3}
//             />
//           )
//         )}
//       </main>
//     </div>
//   );
// }






























import React, { useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowDownToLine,
  BarChart3,
  CalendarDays,
  ChevronDown,
  Clock3,
  Download,
  FileJson,
  Gauge,
  Layers3,
  Printer,
  RefreshCw,
  Search,
  ShieldCheck,
  TrendingUp,
  Zap,
} from "lucide-react";
import prestigeLogo from "../assets/ser-removebg.png";
import { tempApi } from "../tempAdminApi";
import { SYSTEM_ROLES, USER_PERMISSIONS } from "../data/permissionOptions";
import { buildings } from "../data/bmsData";
import {
  filterReadingsForAccount,
  hasPermission as accountHasPermission,
  isSuperAdmin,
} from "../utils/accessControl";
import { getAllZones, normalizeId } from "../utils/bmsHierarchy";

const EQUIPMENT_OPTIONS = [
  // 33kV SOURCE
  { key: "source", label: "33kV Source", group: "33kV Source", multiplier: 0.98, voltageBase: 33000 },
  { key: "source-inc1", label: "INC1 Incoming Feeder", group: "33kV Source", multiplier: 0.96, voltageBase: 33000 },
  { key: "source-out", label: "OUT Outgoing Busbar", group: "33kV Source", multiplier: 0.94, voltageBase: 33000 },
  { key: "source-inc2", label: "INC2 Incoming Feeder", group: "33kV Source", multiplier: 0.92, voltageBase: 33000 },
  { key: "source-meter", label: "Metering Unit", group: "33kV Source", multiplier: 0.90, voltageBase: 33000 },

  // 33kV FEEDER
  { key: "feeder", label: "33kV Feeder Panel", group: "33kV Feeder", multiplier: 0.94, voltageBase: 33000 },
  { key: "feeder-in-1", label: "Incoming Feeder 1", group: "33kV Feeder", multiplier: 0.93, voltageBase: 33000 },
  ...Array.from({ length: 6 }, (_, index) => ({
    key: `feeder-og-${index + 1}`,
    label: `OG ${index + 1}`,
    group: "33kV Feeder",
    multiplier: 0.91 - index * 0.018,
    voltageBase: 33000,
  })),

  // TRANSFORMERS — 6
  { key: "transformer", label: "Transformers", group: "Transformer", multiplier: 0.89, voltageBase: 433 },
  ...Array.from({ length: 6 }, (_, index) => ({
    key: `transformer-${index + 1}`,
    label: `TR-${index + 1}`,
    group: "Transformer",
    multiplier: 0.87 - index * 0.025,
    voltageBase: 433,
  })),

  // LT KIOSK — 6
  { key: "kiosk", label: "LT Kiosk", group: "LT Kiosk", multiplier: 0.84, voltageBase: 433 },
  ...Array.from({ length: 6 }, (_, index) => ({
    key: `kiosk-${index + 1}`,
    label: `KIOSK-${index + 1}`,
    group: "LT Kiosk",
    multiplier: 0.82 - index * 0.022,
    voltageBase: 433,
  })),

  // LT BUSDUCT / BUSBAR — 6
  { key: "busbar", label: "LT Busduct / Busbar", group: "Busduct", multiplier: 0.81, voltageBase: 433 },
  ...Array.from({ length: 6 }, (_, index) => ({
    key: `bus-${index + 1}`,
    label: `BUS-${index + 1}`,
    group: "Busduct",
    multiplier: 0.79 - index * 0.022,
    voltageBase: 433,
  })),

  // PCC MAIN
  { key: "pcc", label: "PCC Main", group: "PCC", multiplier: 0.77, voltageBase: 433 },
  { key: "pcc-1", label: "PCC 1", group: "PCC", multiplier: 0.75, voltageBase: 433 },
  { key: "pcc-2", label: "PCC 2", group: "PCC", multiplier: 0.73, voltageBase: 433 },
  { key: "pcc-3", label: "PCC 3", group: "PCC", multiplier: 0.71, voltageBase: 433 },
  { key: "pcc-4", label: "PCC 4", group: "PCC", multiplier: 0.69, voltageBase: 433 },

  // PCC 1 INNER PANELS
  { key: "pcc1-lt6-in", label: "PCC 1 · LT6 IN", group: "PCC 1 Inner", multiplier: 0.45, voltageBase: 433 },
  { key: "pcc1-dg1234-in-1", label: "PCC 1 · DG1234 IN", group: "PCC 1 Inner", multiplier: 0.43, voltageBase: 433 },
  { key: "pcc1-og1", label: "PCC 1 · OG 1", group: "PCC 1 Inner", multiplier: 0.39, voltageBase: 433 },
  { key: "pcc1-rm1-a", label: "PCC 1 · RM1 A", group: "PCC 1 Inner", multiplier: 0.36, voltageBase: 433 },
  { key: "pcc1-rm2-a", label: "PCC 1 · RM2 A", group: "PCC 1 Inner", multiplier: 0.34, voltageBase: 433 },
  { key: "pcc1-utility1", label: "PCC 1 · Utility 1", group: "PCC 1 Inner", multiplier: 0.31, voltageBase: 433 },
  { key: "pcc1-spare1", label: "PCC 1 · Spare 1", group: "PCC 1 Inner", multiplier: 0.08, voltageBase: 433 },
  { key: "pcc1-bus-coupler", label: "PCC 1 · Bus Coupler B/C", group: "PCC 1 Inner", multiplier: 0.28, voltageBase: 433 },
  { key: "pcc1-lt5-in", label: "PCC 1 · LT5 IN", group: "PCC 1 Inner", multiplier: 0.44, voltageBase: 433 },
  { key: "pcc1-dg1234-in-2", label: "PCC 1 · DG 1234 IN", group: "PCC 1 Inner", multiplier: 0.42, voltageBase: 433 },
  { key: "pcc1-rm1-b", label: "PCC 1 · RM1 B", group: "PCC 1 Inner", multiplier: 0.35, voltageBase: 433 },
  { key: "pcc1-rm2-b", label: "PCC 1 · RM2 B", group: "PCC 1 Inner", multiplier: 0.33, voltageBase: 433 },
  { key: "pcc1-utility2", label: "PCC 1 · Utility 2", group: "PCC 1 Inner", multiplier: 0.30, voltageBase: 433 },
  { key: "pcc1-spare2", label: "PCC 1 · Spare 2", group: "PCC 1 Inner", multiplier: 0.08, voltageBase: 433 },

  // PCC 2 INNER PANELS
  { key: "pcc2-lt1-in", label: "PCC 2 · LT1 IN", group: "PCC 2 Inner", multiplier: 0.45, voltageBase: 433 },
  { key: "pcc2-dg1234-in-1", label: "PCC 2 · DG1234 IN", group: "PCC 2 Inner", multiplier: 0.43, voltageBase: 433 },
  { key: "pcc2-og1", label: "PCC 2 · OG 1", group: "PCC 2 Inner", multiplier: 0.39, voltageBase: 433 },
  { key: "pcc2-rm1-a", label: "PCC 2 · RM1 A", group: "PCC 2 Inner", multiplier: 0.36, voltageBase: 433 },
  { key: "pcc2-rm2-a", label: "PCC 2 · RM2 A", group: "PCC 2 Inner", multiplier: 0.34, voltageBase: 433 },
  { key: "pcc2-utility1", label: "PCC 2 · Utility 1", group: "PCC 2 Inner", multiplier: 0.31, voltageBase: 433 },
  { key: "pcc2-spare1", label: "PCC 2 · Spare 1", group: "PCC 2 Inner", multiplier: 0.08, voltageBase: 433 },
  { key: "pcc2-bus-coupler", label: "PCC 2 · Bus Coupler B/C", group: "PCC 2 Inner", multiplier: 0.28, voltageBase: 433 },
  { key: "pcc2-lt2-in", label: "PCC 2 · LT2 IN", group: "PCC 2 Inner", multiplier: 0.44, voltageBase: 433 },
  { key: "pcc2-dg1234-in-2", label: "PCC 2 · DG 1234 IN", group: "PCC 2 Inner", multiplier: 0.42, voltageBase: 433 },
  { key: "pcc2-rm1-b", label: "PCC 2 · RM1 B", group: "PCC 2 Inner", multiplier: 0.35, voltageBase: 433 },
  { key: "pcc2-rm2-b", label: "PCC 2 · RM2 B", group: "PCC 2 Inner", multiplier: 0.33, voltageBase: 433 },
  { key: "pcc2-utility2", label: "PCC 2 · Utility 2", group: "PCC 2 Inner", multiplier: 0.30, voltageBase: 433 },
  { key: "pcc2-spare2", label: "PCC 2 · Spare 2", group: "PCC 2 Inner", multiplier: 0.08, voltageBase: 433 },

  // PCC 3 / PCC 4 INNER — IN + 10 OG EACH
  { key: "pcc3-lt4-in", label: "PCC 3 · LT4 IN", group: "PCC 3 Inner", multiplier: 0.40, voltageBase: 433 },
  { key: "pcc3-dg567-in", label: "PCC 3 · DG567 IN", group: "PCC 3 Inner", multiplier: 0.38, voltageBase: 433 },
  ...Array.from({ length: 10 }, (_, index) => ({
    key: `pcc3-og-${index + 1}`,
    label: `PCC 3 · OG ${index + 1}`,
    group: "PCC 3 Inner",
    multiplier: 0.28 - index * 0.014,
    voltageBase: 433,
  })),
  { key: "pcc4-lt3-in", label: "PCC 4 · LT3 IN", group: "PCC 4 Inner", multiplier: 0.40, voltageBase: 433 },
  { key: "pcc4-dg567-in", label: "PCC 4 · DG567 IN", group: "PCC 4 Inner", multiplier: 0.38, voltageBase: 433 },
  ...Array.from({ length: 10 }, (_, index) => ({
    key: `pcc4-og-${index + 1}`,
    label: `PCC 4 · OG ${index + 1}`,
    group: "PCC 4 Inner",
    multiplier: 0.28 - index * 0.014,
    voltageBase: 433,
  })),

  // UPS FLOW FROM PCC 1 / PCC 2
  { key: "ups-30kva-1", label: "UPS 30kVA-1", group: "UPS", multiplier: 0.16, voltageBase: 415 },
  { key: "ups-30kva-2", label: "UPS 30kVA-2", group: "UPS", multiplier: 0.15, voltageBase: 415 },
  { key: "ups-10kva-1", label: "UPS 10kVA-1", group: "UPS", multiplier: 0.08, voltageBase: 415 },
  { key: "ups-10kva-2", label: "UPS 10kVA-2", group: "UPS", multiplier: 0.075, voltageBase: 415 },

  // RAISING MAIN
  { key: "raising-main", label: "Raising Main", group: "Raising Main", multiplier: 0.66, voltageBase: 433 },
  { key: "rm-1", label: "Raising Main 1", group: "Raising Main", multiplier: 0.34, voltageBase: 433 },
  { key: "rm-2", label: "Raising Main 2", group: "Raising Main", multiplier: 0.32, voltageBase: 433 },
  { key: "rm-3", label: "Raising Main 3", group: "Raising Main", multiplier: 0.31, voltageBase: 433 },
  { key: "rm-4", label: "Raising Main 4", group: "Raising Main", multiplier: 0.29, voltageBase: 433 },

  // WINGS
  { key: "wing-a", label: "Wing A", group: "Wing", multiplier: 0.30, voltageBase: 433 },
  { key: "wing-b", label: "Wing B", group: "Wing", multiplier: 0.28, voltageBase: 433 },

  // DIESEL GENERATORS — 7
  { key: "dg", label: "Diesel Generator Plant", group: "DG", multiplier: 0.52, voltageBase: 433 },
  ...Array.from({ length: 7 }, (_, index) => ({
    key: `dg-${index + 1}`,
    label: `DG-${index + 1}`,
    group: "DG",
    multiplier: 0.30 - index * 0.018,
    voltageBase: 433,
  })),

  // AUXILIARY SYSTEMS
  { key: "hvac", label: "HVAC", group: "HVAC", multiplier: 0.34, voltageBase: 433 },
  { key: "water-management", label: "Water Management", group: "Water Management", multiplier: 0.14, voltageBase: 433 },
  { key: "stp", label: "STP", group: "Water Management", multiplier: 0.10, voltageBase: 433 },
  { key: "wtp", label: "WTP", group: "Water Management", multiplier: 0.095, voltageBase: 433 },
  ...Array.from({ length: 4 }, (_, index) => ({
    key: `tank-${index + 1}`,
    label: `Tank Level-${index + 1}`,
    group: "Water Management",
    multiplier: 0.045 + index * 0.004,
    voltageBase: 433,
  })),
  // FIRE & LIFE SAFETY — synced with MainOverview
  { key: "fire-alarms", label: "Fire Alarms", group: "Fire", multiplier: 0.06, voltageBase: 230 },
  { key: "fire-fighting", label: "Fire Fighting", group: "Fire", multiplier: 0.055, voltageBase: 230 },
  { key: "fire-pump", label: "Fire Pump", group: "Fire", multiplier: 0.05, voltageBase: 415 },
];

const EQUIPMENT_BY_KEY = Object.fromEntries(
  EQUIPMENT_OPTIONS.map((equipment) => [equipment.key, equipment]),
);

const MAIN_FLOW_OPTIONS = [
  { key: "source", label: "33kV Source", groups: ["33kV Source"] },
  { key: "feeder", label: "33kV Feeder", groups: ["33kV Feeder"] },
  { key: "transformer", label: "Transformer", groups: ["Transformer"] },
  { key: "kiosk", label: "LT Kiosk", groups: ["LT Kiosk"] },
  { key: "busbar", label: "Busduct", groups: ["Busduct"] },
  {
    key: "pcc",
    label: "PCC",
    groups: ["PCC", "PCC 1 Inner", "PCC 2 Inner", "PCC 3 Inner", "PCC 4 Inner"],
  },
  { key: "ups", label: "UPS", groups: ["UPS"] },
  { key: "raising-main", label: "Raising Main", groups: ["Raising Main"] },
  { key: "wing", label: "Wing", groups: ["Wing"] },
  { key: "dg", label: "DG", groups: ["DG"] },
  { key: "hvac", label: "HVAC", groups: ["HVAC"] },
  { key: "water-management", label: "Water Management", groups: ["Water Management"] },
  { key: "fire", label: "Fire", groups: ["Fire"] },
];

const PARENT_EQUIPMENT_KEYS = new Set([
  "source",
  "feeder",
  "transformer",
  "kiosk",
  "busbar",
  "pcc",
  "raising-main",
  "dg",
  "water-management",
]);

const getInnerEquipmentForFlow = (flowKey) => {
  // Main Equipment = All means every individual monitored asset
  // from every main flow is available for download.
  if (flowKey === "all") {
    return EQUIPMENT_OPTIONS.filter(
      (equipment) => !PARENT_EQUIPMENT_KEYS.has(equipment.key),
    );
  }

  const flow = MAIN_FLOW_OPTIONS.find((item) => item.key === flowKey);
  if (!flow) return [];

  let options = EQUIPMENT_OPTIONS.filter(
    (equipment) =>
      flow.groups.includes(equipment.group) &&
      !PARENT_EQUIPMENT_KEYS.has(equipment.key),
  );

  // Single-item systems such as HVAC may have no separate children.
  if (!options.length) {
    const direct = EQUIPMENT_BY_KEY[flowKey];
    if (direct) options = [direct];
  }

  return options;
};

const EQUIPMENT_GROUPS = EQUIPMENT_OPTIONS.reduce((groups, equipment) => {
  const group = equipment.group || "Other";
  if (!groups[group]) groups[group] = [];
  groups[group].push(equipment);
  return groups;
}, {});


const formatDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getCurrentMonth = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
};


const getMainFlowForEquipment = (equipment) => {
  if (!equipment) return null;

  return (
    MAIN_FLOW_OPTIONS.find((flow) =>
      flow.groups.includes(equipment.group),
    ) || null
  );
};

const buildFlowSpecificFeatures = ({
  equipment,
  equipmentIndex,
  hour,
  dayOffset,
  voltage,
  current,
  powerFactor,
  energyKwh,
  energyKvah,
}) => {
  const key = equipment.key;

  const electrical = {
    kWh: Number(energyKwh.toFixed(2)),
    kVAh: Number(energyKvah.toFixed(2)),
    voltage: Number(voltage),
    powerFactor: Number(powerFactor),
    amps: Number(current),
    status: "Live",
  };

  // ---------------------------------------------------------------
  // 33kV SOURCE
  // MainOverview SourceBox monitoring:
  // kWh | kVAh | PF | Voltage | Current
  // ---------------------------------------------------------------
  if (equipment.group === "33kV Source") {
    const sourceValues = {
      "source-inc1": { kWh: 1280, kVAh: 1195, powerFactor: 0.98, voltage: 33000, amps: 420 },
      "source-out": { kWh: 1560, kVAh: 1430, powerFactor: 0.99, voltage: 33000, amps: 460 },
      "source-inc2": { kWh: 1110, kVAh: 1020, powerFactor: 0.97, voltage: 33000, amps: 390 },
      "source-meter": { kWh: 1420, kVAh: 1300, powerFactor: 0.98, voltage: 33000, amps: 435 },
    };

    return {
      ...(sourceValues[key] || electrical),
      status: "Live",
    };
  }

  // ---------------------------------------------------------------
  // 33kV FEEDER
  // MainOverview feeder monitoring:
  // kWh | kVAh | PF | AMPS | Voltage
  // ---------------------------------------------------------------
  if (equipment.group === "33kV Feeder") {
    const feederValues = {
      "feeder-incoming-1": { kWh: 1480, kVAh: 1360, powerFactor: 0.98, voltage: 33000, amps: 430 },
      "feeder-og-1": { kWh: 980, kVAh: 910, powerFactor: 0.97, voltage: 33000, amps: 280 },
      "feeder-og-2": { kWh: 1020, kVAh: 960, powerFactor: 0.98, voltage: 33000, amps: 295 },
      "feeder-og-3": { kWh: 1120, kVAh: 1040, powerFactor: 0.98, voltage: 33000, amps: 310 },
      "feeder-og-4": { kWh: 940, kVAh: 870, powerFactor: 0.96, voltage: 33000, amps: 265 },
      "feeder-og-5": { kWh: 1080, kVAh: 990, powerFactor: 0.98, voltage: 33000, amps: 300 },
      "feeder-og-6": { kWh: 1150, kVAh: 1080, powerFactor: 0.99, voltage: 33000, amps: 325 },
    };

    return {
      ...(feederValues[key] || electrical),
      status: "Live",
    };
  }

  // ---------------------------------------------------------------
  // TRANSFORMER
  // MainOverview transformer cards:
  // Oil Temp | Winding Temp | Buchholz Relay | Load
  // ---------------------------------------------------------------
  if (equipment.group === "Transformer") {
    const transformerValues = {
      "tr-1": { oilTemperature: 54, windingTemperature: 61, buchholzRelay: "Healthy", loadPercent: 68 },
      "tr-2": { oilTemperature: 52, windingTemperature: 59, buchholzRelay: "Healthy", loadPercent: 62 },
      "tr-3": { oilTemperature: 55, windingTemperature: 60, buchholzRelay: "Healthy", loadPercent: 71 },
      "tr-4": { oilTemperature: 53, windingTemperature: 58, buchholzRelay: "Healthy", loadPercent: 65 },
      "tr-5": { oilTemperature: 56, windingTemperature: 63, buchholzRelay: "Healthy", loadPercent: 74 },
      "tr-6": { oilTemperature: 51, windingTemperature: 57, buchholzRelay: "Healthy", loadPercent: 60 },
    };

    return {
      ...(transformerValues[key] || {
        oilTemperature: 54,
        windingTemperature: 61,
        buchholzRelay: "Healthy",
        loadPercent: 68,
      }),
      status: "Live",
    };
  }

  // ---------------------------------------------------------------
  // LT KIOSK
  // MainOverview KioskMonitorBox:
  // kWh | kVAh | PF | AMPS | Voltage
  // ---------------------------------------------------------------
  if (equipment.group === "LT Kiosk") {
    const kioskNumber = Number(key.split("-")[1] || 1);
    return {
      kWh: 1280 + (kioskNumber - 1) * 60,
      kVAh: 1195 + (kioskNumber - 1) * 55,
      powerFactor: kioskNumber % 2 === 1 ? 0.98 : 0.97,
      amps: 420 + (kioskNumber - 1) * 8,
      voltage: 433,
      status: "Live",
    };
  }

  // ---------------------------------------------------------------
  // BUSDuct / BUSBAR
  // MainOverview BusbarMonitorBox:
  // Temp | Vibration | Health
  // ---------------------------------------------------------------
  if (equipment.group === "Busduct") {
    const busNumber = Number(key.split("-")[1] || 1);
    return {
      temperature: 42 + (busNumber - 1),
      vibration: "Normal",
      health: "ON",
      status: "Live",
    };
  }

  // ---------------------------------------------------------------
  // PCC
  // MainOverview PanelFeatures:
  // kWh | kVAh | V | PF | Amps + Live/Inactive status
  // ---------------------------------------------------------------
  if (
    equipment.group === "PCC" ||
    equipment.group === "PCC 1 Inner" ||
    equipment.group === "PCC 2 Inner" ||
    equipment.group === "PCC 3 Inner" ||
    equipment.group === "PCC 4 Inner"
  ) {
    return {
      kWh: 1245 + (equipmentIndex % 14) * 18,
      kVAh: 1180 + (equipmentIndex % 14) * 15,
      voltage: 433,
      powerFactor: equipmentIndex % 2 === 0 ? 0.98 : 0.97,
      amps: 210 + (equipmentIndex % 14) * 4,
      status: "Live",
    };
  }

  // ---------------------------------------------------------------
  // UPS
  // MainOverview createUpsMonitoringData:
  // Capacity | Input V | Output V | Load | Battery | Input Hz |
  // Output Hz | Battery V | Backup Time | Mode | Status
  // ---------------------------------------------------------------
  if (equipment.group === "UPS") {
    const upsIndex = Math.max(
      0,
      ["ups-30kva-1", "ups-30kva-2", "ups-10kva-1", "ups-10kva-2"].indexOf(key),
    );
    const is30kva = key.includes("30kva");

    return {
      capacity: is30kva ? "30 kVA" : "10 kVA",
      inputVoltage: is30kva ? 414 + upsIndex : 412 + upsIndex,
      outputVoltage: is30kva ? 415 + (upsIndex % 2) : 414 + (upsIndex % 2),
      loadPercent: is30kva ? 66 + upsIndex * 3 : 48 + upsIndex * 4,
      batteryPercent: 94 - upsIndex * 2,
      inputFrequency: 50.0,
      outputFrequency: 50.0,
      batteryVoltage: is30kva ? 216 - upsIndex : 192 - upsIndex,
      backupTimeMinutes: is30kva ? 42 - upsIndex * 3 : 58 - upsIndex * 4,
      mode: "Online",
      status: "Normal",
    };
  }

  // ---------------------------------------------------------------
  // RAISING MAIN
  // MainOverview RMBox:
  // kWh | kVAh | V | PF | Amps + Live/Inactive
  // ---------------------------------------------------------------
  if (equipment.group === "Raising Main") {
    const rmNumber = Number(key.split("-")[1] || 1);
    return {
      kWh: 1245 + (rmNumber - 1) * 65,
      kVAh: 1180 + (rmNumber - 1) * 58,
      voltage: 433,
      powerFactor: rmNumber % 2 === 1 ? 0.98 : 0.97,
      amps: 210 + (rmNumber - 1) * 12,
      status: "Live",
    };
  }

  // ---------------------------------------------------------------
  // DG
  // MainOverview DgMonitorBox:
  // kWh | kVAh | PF | AMPS | Voltage
  // ---------------------------------------------------------------
  if (equipment.group === "DG") {
    const dgNumber = Number(key.split("-")[1] || 1);
    return {
      kWh: 1460 + (dgNumber - 1) * 75,
      kVAh: 1375 + (dgNumber - 1) * 68,
      powerFactor: (dgNumber - 1) % 3 === 0 ? 0.97 : 0.98,
      amps: 510 + (dgNumber - 1) * 14,
      voltage: 433,
      status: "Live",
    };
  }

  // ---------------------------------------------------------------
  // WATER MANAGEMENT
  // MainOverview STP/WTP:
  // Inlet Flow | Outlet Flow | pH | Turbidity | Status
  // MainOverview Tanks:
  // Level | Volume | Inlet Flow | Outlet Flow | Status
  // ---------------------------------------------------------------
  if (equipment.group === "Water Management") {
    if (key === "stp") {
      return {
        inletFlow: 82,
        outletFlow: 76,
        ph: 7.2,
        turbidity: 2.4,
        status: "Running",
      };
    }

    if (key === "wtp") {
      return {
        inletFlow: 96,
        outletFlow: 91,
        ph: 7.1,
        turbidity: 1.8,
        status: "Running",
      };
    }

    const tankValues = {
      "tank-1": { levelPercent: 78, volumePercent: 78, inletFlow: 34, outletFlow: 29, status: "Normal" },
      "tank-2": { levelPercent: 64, volumePercent: 64, inletFlow: 28, outletFlow: 25, status: "Normal" },
      "tank-3": { levelPercent: 86, volumePercent: 86, inletFlow: 31, outletFlow: 27, status: "Normal" },
      "tank-4": { levelPercent: 52, volumePercent: 52, inletFlow: 24, outletFlow: 22, status: "Normal" },
    };

    if (tankValues[key]) return tankValues[key];
  }

  // ---------------------------------------------------------------
  // FIRE & LIFE SAFETY
  // Synced with the current MainOverview Fire popup.
  // ---------------------------------------------------------------
  if (equipment.group === "Fire") {
    if (key === "fire-alarms") {
      return {
        smokeDetectors: 128,
        heatDetectors: 64,
        alarmZones: 12,
        activeAlarms: 0,
        status: "Active",
      };
    }

    if (key === "fire-fighting") {
      return {
        systemPressure: 7.2,
        hydrantNetwork: "Normal",
        sprinklerNetwork: "Normal",
        mainValve: "Open",
        status: "Active",
      };
    }

    if (key === "fire-pump") {
      return {
        dischargePressure: 7.5,
        pumpState: "Standby",
        autoMode: "Enabled",
        controller: "Healthy",
        status: "Active",
      };
    }
  }

  // Wing and HVAC do not expose detailed monitoring fields in MainOverview.
  if (
    equipment.group === "Wing" ||
    equipment.group === "HVAC"
  ) {
    return { status: "Active" };
  }

  return electrical;
};

const getFlowFeatureColumns = (equipment) => {
  if (!equipment) return [];

  const electricalColumns = [
    ["kWh", (row) => row.featureData?.kWh],
    ["kVAh", (row) => row.featureData?.kVAh],
    ["PF", (row) => row.featureData?.powerFactor],
    [
      "V / kV",
      (row) =>
        getDisplayVoltage(
          row.featureData?.voltage ?? row.voltage,
        ),
    ],
    ["Amps", (row) => row.featureData?.amps],
    ["Status", (row) => row.featureData?.status],
  ];

  if (equipment.group === "Transformer") {
    return [
      ["Oil Temp °C", (row) => row.featureData?.oilTemperature],
      ["Winding Temp °C", (row) => row.featureData?.windingTemperature],
      ["Buchholz Relay", (row) => row.featureData?.buchholzRelay],
      ["Load %", (row) => row.featureData?.loadPercent],
      ["Status", (row) => row.featureData?.status],
    ];
  }

  if (equipment.group === "Busduct") {
    return [
      ["Temperature °C", (row) => row.featureData?.temperature],
      ["Vibration", (row) => row.featureData?.vibration],
      ["Health", (row) => row.featureData?.health],
      ["Status", (row) => row.featureData?.status],
    ];
  }

  if (equipment.group === "UPS") {
    return [
      ["Capacity", (row) => row.featureData?.capacity],
      ["Input Voltage V", (row) => row.featureData?.inputVoltage],
      ["Output Voltage V", (row) => row.featureData?.outputVoltage],
      ["Load %", (row) => row.featureData?.loadPercent],
      ["Battery %", (row) => row.featureData?.batteryPercent],
      ["Input Frequency Hz", (row) => row.featureData?.inputFrequency],
      ["Output Frequency Hz", (row) => row.featureData?.outputFrequency],
      ["Battery Voltage V DC", (row) => row.featureData?.batteryVoltage],
      ["Backup Time min", (row) => row.featureData?.backupTimeMinutes],
      ["Mode", (row) => row.featureData?.mode],
      ["Status", (row) => row.featureData?.status],
    ];
  }

  if (equipment.group === "Water Management") {
    if (equipment.key === "stp" || equipment.key === "wtp") {
      return [
        ["Inlet Flow m³/h", (row) => row.featureData?.inletFlow],
        ["Outlet Flow m³/h", (row) => row.featureData?.outletFlow],
        ["pH", (row) => row.featureData?.ph],
        ["Turbidity NTU", (row) => row.featureData?.turbidity],
        ["Status", (row) => row.featureData?.status],
      ];
    }

    if (equipment.key.startsWith("tank-")) {
      return [
        ["Level %", (row) => row.featureData?.levelPercent],
        ["Volume %", (row) => row.featureData?.volumePercent],
        ["Inlet Flow m³/h", (row) => row.featureData?.inletFlow],
        ["Outlet Flow m³/h", (row) => row.featureData?.outletFlow],
        ["Status", (row) => row.featureData?.status],
      ];
    }
  }

  if (equipment.group === "Fire") {
    if (equipment.key === "fire-alarms") {
      return [
        ["Smoke Detectors", (row) => row.featureData?.smokeDetectors],
        ["Heat Detectors", (row) => row.featureData?.heatDetectors],
        ["Alarm Zones", (row) => row.featureData?.alarmZones],
        ["Active Alarms", (row) => row.featureData?.activeAlarms],
        ["Status", (row) => row.featureData?.status],
      ];
    }

    if (equipment.key === "fire-fighting") {
      return [
        ["System Pressure bar", (row) => row.featureData?.systemPressure],
        ["Hydrant Network", (row) => row.featureData?.hydrantNetwork],
        ["Sprinkler Network", (row) => row.featureData?.sprinklerNetwork],
        ["Main Valve", (row) => row.featureData?.mainValve],
        ["Status", (row) => row.featureData?.status],
      ];
    }

    if (equipment.key === "fire-pump") {
      return [
        ["Discharge Pressure bar", (row) => row.featureData?.dischargePressure],
        ["Pump State", (row) => row.featureData?.pumpState],
        ["Auto Mode", (row) => row.featureData?.autoMode],
        ["Controller", (row) => row.featureData?.controller],
        ["Status", (row) => row.featureData?.status],
      ];
    }
  }

  if (
    equipment.group === "Wing" ||
    equipment.group === "HVAC"
  ) {
    return [["Status", (row) => row.featureData?.status]];
  }

  return electricalColumns;
};

const getSelectedFeatureColumns = (
  equipmentKeys,
  equipmentOptions,
) => {
  const columns = [];
  const seen = new Set();

  equipmentOptions
    .filter((equipment) => equipmentKeys.includes(equipment.key))
    .forEach((equipment) => {
      getFlowFeatureColumns(equipment).forEach(([heading]) => {
        if (!seen.has(heading)) {
          seen.add(heading);
          columns.push(heading);
        }
      });
    });

  return columns;
};

const getFeatureValueByHeading = (row, heading) => {
  const equipment = EQUIPMENT_BY_KEY[row.equipment];
  if (!equipment) return "";

  const column = getFlowFeatureColumns(equipment).find(
    ([columnHeading]) => columnHeading === heading,
  );

  if (!column) return "";

  const value = column[1](row);
  return value ?? "";
};

const getLatestMonitoringRow = (rows, equipmentKey) => {
  const equipmentRows = rows
    .filter((row) => row.equipment === equipmentKey)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return equipmentRows[0] || null;
};

const getMonitoringFeatureCards = (rows, equipmentKey) => {
  const equipment = EQUIPMENT_BY_KEY[equipmentKey];
  const row = getLatestMonitoringRow(rows, equipmentKey);

  if (!equipment || !row) return [];

  return getFlowFeatureColumns(equipment)
    .filter(([heading]) => heading !== "Status")
    .map(([heading, accessor]) => ({
      label: heading,
      value: accessor(row),
    }));
};

const averageFeatureData = (rows) => {
  if (!rows.length) return {};

  const latestFeatureData = rows[rows.length - 1]?.featureData || {};
  const keys = new Set();

  rows.forEach((row) => {
    Object.keys(row.featureData || {}).forEach((key) => keys.add(key));
  });

  const result = {};

  keys.forEach((key) => {
    const values = rows
      .map((row) => row.featureData?.[key])
      .filter((value) => value !== undefined && value !== null && value !== "");

    if (!values.length) return;

    const numericValues = values.filter(
      (value) => typeof value === "number" && Number.isFinite(value),
    );

    if (numericValues.length === values.length) {
      result[key] = roundExcel(
        numericValues.reduce((sum, value) => sum + value, 0) /
          numericValues.length,
        2,
      );
    } else {
      result[key] = latestFeatureData[key] ?? values[values.length - 1];
    }
  });

  return result;
};

const aggregateEquipmentRows = (groupRows, equipment) => {
  if (!groupRows.length) return null;

  const latest = groupRows[groupRows.length - 1];

  const aggregate = {
    ...latest,
    featureData: averageFeatureData(groupRows),
  };

  const electricalGroups = new Set([
    "33kV Source",
    "33kV Feeder",
    "LT Kiosk",
    "PCC",
    "PCC 1 Inner",
    "PCC 2 Inner",
    "PCC 3 Inner",
    "PCC 4 Inner",
    "Raising Main",
    "DG",
  ]);

  if (electricalGroups.has(equipment.group)) {
    aggregate.energyKwh = sumBy(groupRows, "energyKwh");
    aggregate.energyKvah = sumBy(groupRows, "energyKvah");
    aggregate.voltage = averageBy(groupRows, "voltage");
    aggregate.current = averageBy(groupRows, "current");
    aggregate.powerFactor = averageBy(groupRows, "powerFactor");

    aggregate.featureData = {
      ...aggregate.featureData,
      kWh: roundExcel(sumBy(groupRows, "energyKwh"), 2),
      kVAh: roundExcel(sumBy(groupRows, "energyKvah"), 2),
      voltage: roundExcel(averageBy(groupRows, "voltage"), 2),
      amps: roundExcel(averageBy(groupRows, "current"), 2),
      powerFactor: roundExcel(averageBy(groupRows, "powerFactor"), 3),
      status: latest.featureData?.status || latest.status || "Live",
    };
  }

  return aggregate;
};

const buildFlowWiseExportRows = (rows, equipments, selectedPeriod, selectedDate, selectedMonth) => {
  const result = [];

  equipments.forEach((equipment) => {
    const equipmentRows = rows
      .filter((row) => row.equipment === equipment.key)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    if (!equipmentRows.length) return;

    if (selectedPeriod === "hourly") {
      equipmentRows.forEach((row) => {
        result.push({
          equipment,
          periodValue: row.timestamp.slice(11, 16),
          sourceRow: row,
        });
      });
      return;
    }

    if (selectedPeriod === "daily") {
      const aggregate = aggregateEquipmentRows(equipmentRows, equipment);

      if (aggregate) {
        result.push({
          equipment,
          periodValue: equipmentRows[0].timestamp.slice(0, 10),
          sourceRow: aggregate,
        });
      }
      return;
    }

    if (selectedPeriod === "weekly") {
      // WEEKLY REPORT:
      // Exactly 7 date rows, ending on selectedDate.
      const endDate = new Date(`${selectedDate}T00:00:00`);
      const startDate = new Date(endDate);
      startDate.setDate(endDate.getDate() - 6);

      for (let offset = 0; offset < 7; offset += 1) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + offset);
        const dateKey = formatDateKey(currentDate);

        const dayRows = equipmentRows.filter(
          (row) => row.timestamp.slice(0, 10) === dateKey,
        );

        if (dayRows.length) {
          const aggregate = aggregateEquipmentRows(dayRows, equipment);

          result.push({
            equipment,
            periodValue: dateKey,
            sourceRow: aggregate,
          });
        } else {
          // Keep the date row present without inventing monitoring data.
          result.push({
            equipment,
            periodValue: dateKey,
            sourceRow: {
              ...equipmentRows[equipmentRows.length - 1],
              timestamp: `${dateKey}T00:00:00`,
              energyKwh: 0,
              energyKvah: 0,
              voltage: 0,
              current: 0,
              powerFactor: 0,
              featureData: {},
              status: "",
            },
          });
        }
      }

      return;
    }

    if (selectedPeriod === "monthly") {
      // MONTHLY REPORT:
      // One row for every calendar day of selectedMonth, followed by MONTH TOTAL.
      const [yearText, monthText] = selectedMonth.split("-");
      const year = Number(yearText);
      const monthIndex = Number(monthText) - 1;
      const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

      for (let day = 1; day <= daysInMonth; day += 1) {
        const dateKey = `${yearText}-${monthText}-${String(day).padStart(2, "0")}`;

        const dayRows = equipmentRows.filter(
          (row) => row.timestamp.slice(0, 10) === dateKey,
        );

        if (dayRows.length) {
          const aggregate = aggregateEquipmentRows(dayRows, equipment);

          result.push({
            equipment,
            periodValue: dateKey,
            sourceRow: aggregate,
          });
        } else {
          // Preserve the calendar row, but do not fabricate consumption.
          result.push({
            equipment,
            periodValue: dateKey,
            sourceRow: {
              ...equipmentRows[equipmentRows.length - 1],
              timestamp: `${dateKey}T00:00:00`,
              energyKwh: 0,
              energyKvah: 0,
              voltage: 0,
              current: 0,
              powerFactor: 0,
              featureData: {},
              status: "",
            },
          });
        }
      }

      const monthlyAggregate = aggregateEquipmentRows(
        equipmentRows,
        equipment,
      );

      if (monthlyAggregate) {
        result.push({
          equipment,
          periodValue: "MONTH TOTAL",
          sourceRow: monthlyAggregate,
        });
      }

      return;
    }

    if (selectedPeriod === "custom") {
      const dailyGroups = equipmentRows.reduce((accumulator, row) => {
        const dateKey = row.timestamp.slice(0, 10);
        if (!accumulator[dateKey]) accumulator[dateKey] = [];
        accumulator[dateKey].push(row);
        return accumulator;
      }, {});

      Object.entries(dailyGroups)
        .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
        .forEach(([dateKey, dayRows]) => {
          const aggregate = aggregateEquipmentRows(dayRows, equipment);
          if (!aggregate) return;

          result.push({
            equipment,
            periodValue: dateKey,
            sourceRow: aggregate,
          });
        });
    }
  });

  return result;
};

const generateAnalyticsData = () => {
  const rows = [];
  const today = new Date();

  for (let dayOffset = 60; dayOffset >= 0; dayOffset -= 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - dayOffset);
    const dateKey = formatDateKey(date);

    EQUIPMENT_OPTIONS.forEach((equipment, equipmentIndex) => {
      const multiplier = equipment.multiplier ?? 0.5;

      for (let hour = 0; hour < 24; hour += 1) {
        const daylightFactor =
          hour >= 6 && hour <= 22
            ? 0.72 + Math.sin(((hour - 6) / 16) * Math.PI) * 0.38
            : 0.52;

        const weekdayFactor =
          date.getDay() === 0 || date.getDay() === 6 ? 0.88 : 1;

        const baseIncoming = 1080 * multiplier * daylightFactor * weekdayFactor;

        const dailyNoise =
          ((dayOffset * 13 + hour * 7 + equipmentIndex * 11) % 35) - 17;

        const incomingKw = Math.max(30, Math.round(baseIncoming + dailyNoise));

        const lossRatio =
          0.025 + (equipmentIndex % 8) * 0.004;

        const outgoingKw = Math.max(
          20,
          Math.round(incomingKw * (1 - lossRatio)),
        );

        const energyKwh = Number(((incomingKw + outgoingKw) / 2).toFixed(2));

        const voltageBase = equipment.voltageBase ?? 433;

        const voltageVariation =
          voltageBase >= 10000
            ? ((hour + dayOffset) % 9) * 18 - 72
            : ((hour + equipmentIndex) % 7) - 3;

        const voltage = voltageBase + voltageVariation;
        const current = Number(
          (
            (outgoingKw * 1000) /
            (Math.sqrt(3) * voltage * (0.95 + (equipmentIndex % 3) * 0.01))
          ).toFixed(2),
        );

        const powerFactor = Number(
          (0.95 + ((hour + equipmentIndex) % 4) * 0.01).toFixed(2),
        );

        // Frontend apparent-energy value.
        // Later replace with the actual meter/API kVAh register.
        const energyKvah = Number(
          (energyKwh / Math.max(powerFactor, 0.01)).toFixed(2),
        );

        const timestamp = `${dateKey}T${String(hour).padStart(2, "0")}:00:00`;

        const featureData = buildFlowSpecificFeatures({
          equipment,
          equipmentIndex,
          hour,
          dayOffset,
          voltage,
          current,
          powerFactor,
          energyKwh,
          energyKvah,
        });

        rows.push({
          timestamp,
          equipment: equipment.key,
          equipmentLabel: equipment.label,
          flowGroup: equipment.group || equipment.label,
          incomingKw,
          outgoingKw,
          energyKwh,
          energyKvah,
          voltage,
          current,
          powerFactor,
          featureData,
          status:
            featureData?.status ||
            (outgoingKw / incomingKw < 0.88 ? "Attention" : "Normal"),
        });
      }
    });
  }

  return rows;
};

const ANALYTICS_DATA = generateAnalyticsData();

const Card = ({ children, className = "" }) => (
  <div
    className={`relative overflow-hidden rounded-[14px] border border-[#C9D8E7] bg-white shadow-[0_10px_26px_rgba(8,31,92,0.07)] ${className}`}
  >
    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#17A8DB]/45 to-transparent" />
    {children}
  </div>
);

const SectionTitle = ({ title, subtitle, rightContent, icon: Icon }) => (
  <div className="mb-2.5 flex flex-wrap items-center justify-between gap-3">
    <div className="flex items-start gap-3">
      {Icon && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px] border border-[#C9DCEF] bg-[linear-gradient(145deg,#F8FBFF,#E8F2FA)] text-[#1B73C9] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
          <Icon size={18} strokeWidth={2} />
        </div>
      )}

      <div>
        <h2 className="text-[14px] font-semibold tracking-[-0.01em] text-[#06224F]">
          {title}
        </h2>

        {subtitle && (
          <p className="mt-1 max-w-3xl text-[9px] leading-relaxed text-[#687F99]">
            {subtitle}
          </p>
        )}
      </div>
    </div>

    {rightContent}
  </div>
);

const RestrictedState = ({ title, message, icon: Icon = ShieldCheck }) => (
  <Card className="flex h-full min-h-[260px] flex-col items-center justify-center p-6 text-center">
    <div className="flex h-12 w-12 items-center justify-center rounded-[14px] border border-amber-200 bg-amber-50 text-amber-600">
      <Icon size={22} />
    </div>
    <h3 className="mt-4 text-[15px] font-bold text-[#06224F]">
      {title}
    </h3>
    <p className="mt-2 max-w-md text-[11px] leading-6 text-[#687F99]">
      {message}
    </p>
  </Card>
);

const MetricCard = ({
  label,
  value,
  unit,
  tone = "blue",
  icon: Icon,
  trend,
}) => {
  const toneMap = {
    blue: {
      text: "text-[#1B73C9]",
      icon: "text-[#1B73C9]",
      iconBg: "bg-[#EAF4FD]",
      iconBorder: "border-[#D8E6FF]",
      accent: "from-[#1B73C9] to-[#17A8DB]",
    },
    cyan: {
      text: "text-[#0E86B7]",
      icon: "text-[#0E86B7]",
      iconBg: "bg-[#ECFEFF]",
      iconBorder: "border-[#C7F1F5]",
      accent: "from-[#17A8DB] to-[#5DD9FF]",
    },
    green: {
      text: "text-[#15805F]",
      icon: "text-[#15805F]",
      iconBg: "bg-[#ECFDF5]",
      iconBorder: "border-[#CBEFDB]",
      accent: "from-[#16A34A] to-[#34D399]",
    },
    amber: {
      text: "text-[#B7791F]",
      icon: "text-[#B7791F]",
      iconBg: "bg-[#FFF8E8]",
      iconBorder: "border-[#F8E4B0]",
      accent: "from-[#F59E0B] to-[#FBBF24]",
    },
    red: {
      text: "text-[#B42318]",
      icon: "text-[#B42318]",
      iconBg: "bg-[#FFF1F2]",
      iconBorder: "border-[#FFD5D9]",
      accent: "from-[#DC2626] to-[#F87171]",
    },
  };

  const activeTone = toneMap[tone] || toneMap.blue;

  return (
    <Card className="print-safe group flex h-full min-h-0 flex-col justify-between p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#BDD2E8] hover:shadow-[0_18px_42px_rgba(8,31,92,0.12)]">
      <div
        className={`absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r ${activeTone.accent}`}
      />

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[13px] font-bold uppercase tracking-[0.08em] text-[#5E738B]">
            {label}
          </p>

          <div className="mt-3 flex min-w-0 flex-wrap items-end gap-x-2 gap-y-1">
            <h3
              className={`max-w-full break-words text-[clamp(18px,1.8vw,22px)] font-medium leading-tight tracking-[-0.02em] ${activeTone.text}`}
            >
              {value}
            </h3>

            {unit && (
              <span className="pb-1 text-[11px] font-medium uppercase text-[#7C91A8]">
                {unit}
              </span>
            )}
          </div>
        </div>

        {Icon && (
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[11px] border ${activeTone.iconBorder} ${activeTone.iconBg} ${activeTone.icon}`}
          >
            <Icon size={20} strokeWidth={2} />
          </div>
        )}
      </div>

      {trend && (
        <div className="mt-3 flex justify-end">
          <span className="rounded-full border border-[#CBEFDB] bg-[#ECFDF5] px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.08em] text-[#15805F]">
            {trend}
          </span>
        </div>
      )}
    </Card>
  );
};

const TrendChart = ({ rows }) => {
  if (!rows.length) {
    return (
      <div className="flex h-[260px] items-center justify-center text-[11px] text-[#687F99]">
        No analytics data found for the selected filters.
      </div>
    );
  }

  const width = 820;
  const height = 230;
  const left = 58;
  const right = 790;
  const top = 24;
  const bottom = 180;
  const chartWidth = right - left;
  const chartHeight = bottom - top;

  const maxValue = Math.max(
    ...rows.flatMap((row) => [row.incomingKw, row.outgoingKw]),
    1,
  );

  const step = Math.max(1, Math.ceil(rows.length / 24));
  const chartRows = rows.filter(
    (_, index) => index % step === 0 || index === rows.length - 1,
  );

  const coordinates = chartRows.map((row, index) => {
    const x =
      chartRows.length === 1
        ? left
        : left + (index / (chartRows.length - 1)) * chartWidth;

    return {
      x,
      incomingY: bottom - (Number(row.incomingKw) / maxValue) * chartHeight,
      outgoingY: bottom - (Number(row.outgoingKw) / maxValue) * chartHeight,
      row,
    };
  });

  const incomingPoints = coordinates
    .map((item) => `${item.x},${item.incomingY}`)
    .join(" ");

  const outgoingPoints = coordinates
    .map((item) => `${item.x},${item.outgoingY}`)
    .join(" ");

  const labelStep = Math.max(1, Math.ceil(coordinates.length / 7));

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      className="h-full min-h-[220px] w-full"
    >
      {[0, 1, 2, 3, 4].map((index) => {
        const y = top + index * (chartHeight / 4);
        const value = maxValue - index * (maxValue / 4);

        return (
          <React.Fragment key={index}>
            <line
              x1={left}
              x2={right}
              y1={y}
              y2={y}
              stroke="rgba(8,31,92,0.10)"
              strokeDasharray="4 4"
            />
            <text
              x={left - 8}
              y={y + 3}
              textAnchor="end"
              fontSize="8"
              fill="#8192A7"
            >
              {Math.round(value)}
            </text>
          </React.Fragment>
        );
      })}

      <polyline
        points={incomingPoints}
        fill="none"
        stroke="#17A8DB"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <polyline
        points={outgoingPoints}
        fill="none"
        stroke="#06224F"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {coordinates.map((item, index) => (
        <g key={`${item.row.timestamp}-${index}`}>
          <circle cx={item.x} cy={item.incomingY} r="3" fill="#17A8DB" />
          <circle cx={item.x} cy={item.outgoingY} r="3" fill="#06224F" />

          <title>
            {`${new Date(item.row.timestamp).toLocaleString()} | Incoming ${item.row.incomingKw} kW | Outgoing ${item.row.outgoingKw} kW`}
          </title>

          {(index % labelStep === 0 || index === coordinates.length - 1) && (
            <text
              x={item.x}
              y="205"
              textAnchor="middle"
              fontSize="8"
              fill="#687F99"
            >
              {new Date(item.row.timestamp).toLocaleDateString(undefined, {
                month: "short",
                day: "2-digit",
                hour: "2-digit",
              })}
            </text>
          )}
        </g>
      ))}

      <g transform="translate(610,15)">
        <circle cx="0" cy="0" r="4" fill="#17A8DB" />
        <text x="10" y="3" fontSize="9" fill="#687F99">
          Incoming
        </text>

        <circle cx="90" cy="0" r="4" fill="#06224F" />
        <text x="100" y="3" fontSize="9" fill="#687F99">
          Outgoing
        </text>
      </g>
    </svg>
  );
};

const EnergyBars = ({ rows }) => {
  if (!rows.length) {
    return null;
  }

  const grouped = rows.reduce((accumulator, row) => {
    const key = row.timestamp.slice(0, 13);
    accumulator[key] = (accumulator[key] || 0) + Number(row.energyKwh || 0);
    return accumulator;
  }, {});

  const points = Object.entries(grouped).slice(-12);
  const maxValue = Math.max(...points.map(([, value]) => value), 1);

  return (
    <div className="flex h-full min-h-0 items-end gap-2 pb-1">
      {points.map(([label, value]) => (
        <div
          key={label}
          className="flex min-w-0 flex-1 flex-col items-center justify-end"
        >
          <div className="mb-2 text-[8px] font-semibold text-[#06224F]">
            {Math.round(value)}
          </div>

          <div
            className="w-full max-w-[30px] rounded-t-[8px] bg-[linear-gradient(180deg,#17A8DB_0%,#1B73C9_100%)] shadow-[0_8px_16px_rgba(37,99,235,0.16)]"
            style={{
              height: `${Math.max(10, (value / maxValue) * 70)}px`,
            }}
          />

          <p className="mt-1.5 truncate text-[7px] text-[#687F99]">
            {label.slice(11, 13)}h
          </p>
        </div>
      ))}
    </div>
  );
};

const escapeCsv = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;

const triggerDownload = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

const getFirstBuildingIdFromScope = (account) => {
  const assignedBuildingId = account?.assignedBuildingIds?.[0];
  const assignedFloorId = account?.assignedFloorIds?.[0];

  return (
    assignedBuildingId ||
    normalizeId(assignedFloorId).split(":")[0] ||
    buildings[0]?.id ||
    ""
  );
};

const getFirstFloorIdFromScope = (account, buildingId) => {
  const assignedFloorId = account?.assignedFloorIds?.find((floorId) =>
    normalizeId(floorId).startsWith(`${buildingId}:`)
  );

  return assignedFloorId || (buildingId ? `${buildingId}:1` : "");
};

const scaleReadingForZoneCount = (row, zoneCount) => ({
  ...row,
  incomingKw: Math.max(0, Math.round(Number(row.incomingKw || 0) / zoneCount)),
  outgoingKw: Math.max(0, Math.round(Number(row.outgoingKw || 0) / zoneCount)),
  energyKwh: Number((Number(row.energyKwh || 0) / zoneCount).toFixed(2)),
  energyKvah: Number((Number(row.energyKvah || 0) / zoneCount).toFixed(2)),
  current: Number((Number(row.current || 0) / zoneCount).toFixed(2)),
});


const roundExcel = (value, digits = 2) => {
  const multiplier = 10 ** digits;
  return Math.round((Number(value) + Number.EPSILON) * multiplier) / multiplier;
};

const getVoltageUnit = (voltage) =>
  Number(voltage) >= 10000 ? "kV" : "V";

const getDisplayVoltage = (voltage) =>
  Number(voltage) >= 10000
    ? roundExcel(Number(voltage) / 1000, 2)
    : roundExcel(Number(voltage), 2);

const averageBy = (rows, field) => {
  if (!rows.length) return 0;
  return (
    rows.reduce(
      (sum, row) => sum + Number(row[field] || 0),
      0,
    ) / rows.length
  );
};

const sumBy = (rows, field) =>
  rows.reduce(
    (sum, row) => sum + Number(row[field] || 0),
    0,
  );

const startOfWeekMonday = (dateValue) => {
  const date = new Date(`${dateValue}T00:00:00`);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
};

const endOfWeekSunday = (weekStart) => {
  const end = new Date(weekStart);
  end.setDate(end.getDate() + 6);
  return end;
};


const buildRealtimeSnapshot = (equipment, latestRow) => {
  if (!equipment || !latestRow) return null;

  const now = new Date();
  const hourStart = new Date(now);
  hourStart.setMinutes(0, 0, 0);

  // Frontend-live snapshot based on the latest available reading.
  // Replace the values below directly with the realtime BMS/API response later.
  const minuteFactor = now.getMinutes() / 60;
  const incomingKw = Math.max(
    1,
    Number(latestRow.incomingKw || 0) * (0.97 + minuteFactor * 0.04),
  );
  const outgoingKw = Math.max(
    1,
    Number(latestRow.outgoingKw || 0) * (0.97 + minuteFactor * 0.035),
  );
  const voltage = Number(latestRow.voltage || equipment.voltageBase || 433);
  const powerFactor = Number(latestRow.powerFactor || 0.98);
  const current = Number(
    (
      (outgoingKw * 1000) /
      (Math.sqrt(3) * Math.max(voltage, 1) * Math.max(powerFactor, 0.01))
    ).toFixed(2),
  );

  const energyKwh = Number(
    (((incomingKw + outgoingKw) / 2) * Math.max(minuteFactor, 1 / 60)).toFixed(2),
  );

  const energyKvah = Number(
    (energyKwh / Math.max(powerFactor, 0.01)).toFixed(2),
  );

  return {
    ...latestRow,
    timestamp: `${formatDateKey(hourStart)}T${String(
      hourStart.getHours(),
    ).padStart(2, "0")}:00:00`,
    incomingKw: Number(incomingKw.toFixed(2)),
    outgoingKw: Number(outgoingKw.toFixed(2)),
    energyKwh,
    energyKvah,
    voltage,
    current,
    powerFactor,
    status:
      outgoingKw / Math.max(incomingKw, 1) < 0.88
        ? "Attention"
        : "Normal",
    realtime: true,
  };
};

const mergeRealtimeSnapshot = (rows, selectedEquipment) => {
  if (!rows.length) return rows;

  const equipment = EQUIPMENT_BY_KEY[selectedEquipment];
  const sorted = [...rows].sort(
    (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
  );

  const latest = sorted[sorted.length - 1];
  const snapshot = buildRealtimeSnapshot(equipment, latest);

  if (!snapshot) return sorted;

  const snapshotHour = snapshot.timestamp.slice(0, 13);
  const withoutCurrentHour = sorted.filter(
    (row) => row.timestamp.slice(0, 13) !== snapshotHour,
  );

  return [...withoutCurrentHour, snapshot].sort(
    (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
  );
};

const buildHourlyExcelRows = (rows) =>
  [...rows]
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    .map((row) => ({
      Date: row.timestamp.slice(0, 10),
      Time: row.timestamp.slice(11, 16),
      "kWh": roundExcel(row.energyKwh, 2),
      "kVAh": roundExcel(row.energyKvah, 2),
      "V / kV": getDisplayVoltage(row.voltage),
      PF: roundExcel(row.powerFactor, 2),
      Amps: roundExcel(row.current, 2),
    }));

const buildDailyExcelRows = (rows) => {
  const groups = rows.reduce((accumulator, row) => {
    const key = row.timestamp.slice(0, 10);
    if (!accumulator[key]) accumulator[key] = [];
    accumulator[key].push(row);
    return accumulator;
  }, {});

  return Object.entries(groups)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, groupRows]) => ({
      Date: date,
      "kWh": roundExcel(sumBy(groupRows, "energyKwh"), 2),
      "kVAh": roundExcel(sumBy(groupRows, "energyKvah"), 2),
      "V / kV": getDisplayVoltage(averageBy(groupRows, "voltage")),
      PF: roundExcel(averageBy(groupRows, "powerFactor"), 3),
      Amps: roundExcel(averageBy(groupRows, "current"), 2),
    }));
};

const buildWeeklyExcelRows = (rows) => {
  const dailyRows = buildDailyExcelRows(rows);
  if (!dailyRows.length) return [];

  const weekStart = startOfWeekMonday(dailyRows[0].Date);
  const result = [];

  for (let offset = 0; offset < 7; offset += 1) {
    const day = new Date(weekStart);
    day.setDate(day.getDate() + offset);
    const dateKey = formatDateKey(day);
    const existing = dailyRows.find((row) => row.Date === dateKey);

    result.push(
      existing || {
        Date: dateKey,
        "kWh": 0,
        "kVAh": 0,
        "V / kV": "",
        PF: "",
        Amps: "",
      },
    );
  }

  return result;
};

const buildMonthlyExcelRows = (rows) => {
  return buildDailyExcelRows(rows);
};

const applyExcelSheetLayout = (worksheet, widths) => {
  worksheet["!cols"] = widths.map((width) => ({ wch: width }));

  if (worksheet["!ref"]) {
    worksheet["!autofilter"] = {
      ref: worksheet["!ref"],
    };
  }
};

export default function OverviewPage() {
  const currentUser = tempApi.getCurrentAccount();
  const canViewReports = accountHasPermission(
    currentUser,
    USER_PERMISSIONS.ANALYTICS_VIEW
  );
  const canDownloadReports = accountHasPermission(
    currentUser,
    USER_PERMISSIONS.DATA_DOWNLOAD
  );

  const [selectedMainFlow, setSelectedMainFlow] = useState("source");
  const [selectedEquipment, setSelectedEquipment] = useState(
    () => getInnerEquipmentForFlow("source")[0]?.key || "source",
  );

  const [selectedPeriod, setSelectedPeriod] = useState("daily");

  const [selectedDate, setSelectedDate] = useState(formatDateKey(new Date()));

  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());

  const [fromTime, setFromTime] = useState("00:00");
  const [toTime, setToTime] = useState("23:59");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [activeWorkspace, setActiveWorkspace] = useState("analytics");

  const isPrivilegedAccount =
    isSuperAdmin(currentUser) ||
    currentUser?.systemRole === SYSTEM_ROLES.ADMIN;
  const canViewLiveReadings = accountHasPermission(
    currentUser,
    USER_PERMISSIONS.LIVE_MONITORING_VIEW
  );
  const accessibleZones = useMemo(() => {
    if (!currentUser || isPrivilegedAccount) {
      return [];
    }

    const assignedZoneIds = new Set(
      (currentUser.assignedZoneIds ?? []).map(normalizeId)
    );

    return getAllZones().filter((zone) =>
      assignedZoneIds.has(normalizeId(zone.id))
    );
  }, [currentUser, isPrivilegedAccount]);
  const hasOverviewDataScope =
    isPrivilegedAccount || accessibleZones.length > 0;

  const scopedSourceData = useMemo(() => {
    if (!currentUser) {
      return [];
    }

    if (!isPrivilegedAccount && accessibleZones.length === 0) {
      return [];
    }

    if (!isPrivilegedAccount) {
      const scopedRows = ANALYTICS_DATA.flatMap((row) => {
        const zonesForRow =
          row.equipment === "wing-a" || row.equipment === "wing-b"
            ? accessibleZones.filter(
                (zone) =>
                  normalizeId(zone.buildingId) === normalizeId(row.equipment)
              )
            : accessibleZones;

        if (zonesForRow.length === 0) {
          return [];
        }

        return zonesForRow.map((zone) => ({
          ...scaleReadingForZoneCount(row, zonesForRow.length),
          buildingId: zone.buildingId,
          blockId: zone.blockId,
          floorId: zone.floorId,
          zoneId: zone.id,
          clientId: zone.clientId,
          systemId: "",
        }));
      });

      return filterReadingsForAccount(currentUser, scopedRows);
    }

    const fallbackBuildingId = getFirstBuildingIdFromScope(currentUser);

    const scopedRows = ANALYTICS_DATA.map((row) => {
      const buildingId =
        row.equipment === "wing-a" || row.equipment === "wing-b"
          ? row.equipment
          : fallbackBuildingId;
      const floorId = getFirstFloorIdFromScope(currentUser, buildingId);
      const blockId = buildingId ? `${buildingId}-core` : "";

      return {
        ...row,
        buildingId,
        blockId,
        floorId,
        systemId: "",
        clientId: currentUser?.assignedClientIds?.[0] || "",
      };
    });

    return filterReadingsForAccount(currentUser, scopedRows);
  }, [accessibleZones, currentUser, isPrivilegedAccount]);

  const innerEquipmentOptions = useMemo(
    () => getInnerEquipmentForFlow(selectedMainFlow),
    [selectedMainFlow],
  );

  const selectedMainFlowLabel =
    selectedMainFlow === "all"
      ? "All Flows"
      : MAIN_FLOW_OPTIONS.find((item) => item.key === selectedMainFlow)?.label ||
        "33kV Source";

  const isAllInnerEquipment = selectedEquipment === "all";

  const selectedEquipmentKeys = useMemo(
    () =>
      isAllInnerEquipment
        ? innerEquipmentOptions.map((equipment) => equipment.key)
        : [selectedEquipment],
    [innerEquipmentOptions, isAllInnerEquipment, selectedEquipment],
  );

  const selectedEquipmentLabel = isAllInnerEquipment
    ? selectedMainFlow === "all"
      ? "All Equipment"
      : `All ${selectedMainFlowLabel}`
    : EQUIPMENT_BY_KEY[selectedEquipment]?.label ||
      innerEquipmentOptions[0]?.label ||
      selectedMainFlowLabel;

  const selectedFeatureColumns = useMemo(
    () =>
      getSelectedFeatureColumns(
        selectedEquipmentKeys,
        innerEquipmentOptions,
      ),
    [selectedEquipmentKeys, innerEquipmentOptions],
  );

  const filteredData = useMemo(() => {
    return scopedSourceData.filter((row) => {
      if (!selectedEquipmentKeys.includes(row.equipment)) {
        return false;
      }

      const timestamp = new Date(row.timestamp);
      const rowDate = row.timestamp.slice(0, 10);
      const rowMonth = row.timestamp.slice(0, 7);
      const rowTime = row.timestamp.slice(11, 16);

      if (selectedPeriod === "hourly") {
        return (
          rowDate === selectedDate && rowTime >= fromTime && rowTime <= toTime
        );
      }

      if (selectedPeriod === "daily") {
        return rowDate === selectedDate;
      }

      if (selectedPeriod === "weekly") {
        const weekEnd = new Date(`${selectedDate}T23:59:59`);
        const weekStart = new Date(`${selectedDate}T00:00:00`);
        weekStart.setDate(weekStart.getDate() - 6);

        return timestamp >= weekStart && timestamp <= weekEnd;
      }

      if (selectedPeriod === "monthly") {
        return rowMonth === selectedMonth;
      }

      if (selectedPeriod === "custom") {
        const start = customStart ? new Date(customStart) : null;
        const end = customEnd ? new Date(customEnd) : null;

        if (start && timestamp < start) {
          return false;
        }

        if (end && timestamp > end) {
          return false;
        }

        return true;
      }

      return true;
    });
  }, [
    scopedSourceData,
    selectedEquipment,
    selectedEquipmentKeys,
    selectedPeriod,
    selectedDate,
    selectedMonth,
    fromTime,
    toTime,
    customStart,
    customEnd,
  ]);

  const selectedMonitoringCards = useMemo(() => {
    if (selectedEquipment === "all") return [];

    return getMonitoringFeatureCards(
      filteredData,
      selectedEquipment,
    );
  }, [filteredData, selectedEquipment]);

  const selectedMonitoringStatus = useMemo(() => {
    if (selectedEquipment === "all") return "";

    const latest = getLatestMonitoringRow(
      filteredData,
      selectedEquipment,
    );

    return latest?.featureData?.status || latest?.status || "";
  }, [filteredData, selectedEquipment]);

  const selectedEquipmentDefinition =
    selectedEquipment !== "all"
      ? EQUIPMENT_BY_KEY[selectedEquipment]
      : null;

  const selectedUsesElectricalAnalytics =
    selectedEquipmentDefinition &&
    ![
      "Transformer",
      "Busduct",
      "UPS",
      "Water Management",
      "Wing",
      "HVAC",
      "Fire",
    ].includes(selectedEquipmentDefinition.group);

  const summary = useMemo(() => {
    if (!filteredData.length) {
      return {
        totalEnergy: 0,
        peakLoad: 0,
        averageLoad: 0,
        totalLoss: 0,
        efficiency: 0,
        averageVoltage: 0,
        averageCurrent: 0,
        averagePowerFactor: 0,
      };
    }

    const totalEnergy = filteredData.reduce(
      (sum, row) => sum + Number(row.energyKwh || 0),
      0,
    );

    const peakLoad = Math.max(
      ...filteredData.map((row) => Number(row.incomingKw || 0)),
    );

    const averageLoad =
      filteredData.reduce((sum, row) => sum + Number(row.outgoingKw || 0), 0) /
      filteredData.length;

    const totalIncoming = filteredData.reduce(
      (sum, row) => sum + Number(row.incomingKw || 0),
      0,
    );

    const totalOutgoing = filteredData.reduce(
      (sum, row) => sum + Number(row.outgoingKw || 0),
      0,
    );

    const averageVoltage =
      filteredData.reduce((sum, row) => sum + Number(row.voltage || 0), 0) /
      filteredData.length;

    const averageCurrent =
      filteredData.reduce((sum, row) => sum + Number(row.current || 0), 0) /
      filteredData.length;

    const averagePowerFactor =
      filteredData.reduce((sum, row) => sum + Number(row.powerFactor || 0), 0) /
      filteredData.length;

    return {
      totalEnergy,
      peakLoad,
      averageLoad,
      totalLoss: Math.max(0, totalIncoming - totalOutgoing),
      efficiency: totalIncoming > 0 ? (totalOutgoing / totalIncoming) * 100 : 0,
      averageVoltage,
      averageCurrent,
      averagePowerFactor,
    };
  }, [filteredData]);

  const downloadCsv = () => {
    if (!canDownloadReports) return;

    const matchesSelectedPeriod = (row) => {
      const rowDate = row.timestamp.slice(0, 10);
      const rowTime = row.timestamp.slice(11, 16);

      if (selectedPeriod === "hourly") {
        const inTime = rowTime >= fromTime && rowTime <= toTime;

        if (customStart && customEnd && customStart !== customEnd) {
          return rowDate >= customStart && rowDate <= customEnd && inTime;
        }

        return rowDate === selectedDate && inTime;
      }

      if (selectedPeriod === "daily") {
        if (customStart && customEnd && customStart !== customEnd) {
          return rowDate >= customStart && rowDate <= customEnd;
        }

        return rowDate === selectedDate;
      }

      if (selectedPeriod === "weekly") {
        // Weekly report = exactly 7 calendar days ending on selectedDate.
        // This avoids a "weekly" report showing only one day when the
        // selected date is at the beginning of the current week.
        const end = new Date(`${selectedDate}T00:00:00`);
        const start = new Date(end);
        start.setDate(end.getDate() - 6);

        const current = new Date(`${rowDate}T00:00:00`);
        return current >= start && current <= end;
      }

      if (selectedPeriod === "monthly") {
        return rowDate.slice(0, 7) === selectedMonth;
      }

      if (selectedPeriod === "custom") {
        return rowDate >= customStart && rowDate <= customEnd;
      }

      return true;
    };

    const escapeCsv = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const periodHeading =
      selectedPeriod === "hourly" ? "Time" : "Date";

    const buildCsvFlowSection = (flow, equipments) => {
      const equipmentKeys = equipments.map((equipment) => equipment.key);

      const flowRows = scopedSourceData
        .filter((row) => equipmentKeys.includes(row.equipment))
        .filter(matchesSelectedPeriod);

      if (!flowRows.length) return [];

      const exportedRows = buildFlowWiseExportRows(
        flowRows,
        equipments,
        selectedPeriod,
        selectedDate,
        selectedMonth,
      );

      if (!exportedRows.length) return [];

      // Collect only the monitoring fields that belong to this flow's
      // equipment. No hard-coded kWh/kVAh/Amps columns.
      const featureColumnNames = [];

      equipments.forEach((equipment) => {
        getFlowFeatureColumns(equipment).forEach(([heading]) => {
          if (!featureColumnNames.includes(heading)) {
            featureColumnNames.push(heading);
          }
        });
      });

      const section = [];

      // Flow name
      section.push([flow.label]);

      // Equipment + the exact MainOverview monitoring fields
      section.push([
        "Equipment",
        periodHeading,
        ...featureColumnNames,
      ]);

      exportedRows.forEach(({ equipment, periodValue, sourceRow }) => {
        const equipmentColumns = new Map(
          getFlowFeatureColumns(equipment).map(([heading, accessor]) => [
            heading,
            accessor,
          ]),
        );

        section.push([
          equipment.label,
          periodValue,
          ...featureColumnNames.map((heading) => {
            const accessor = equipmentColumns.get(heading);
            return accessor ? accessor(sourceRow) ?? "" : "";
          }),
        ]);
      });

      return section;
    };

    let csvRows = [];
    let fileLabel = "";

    // ALL -> flow name, equipment, exact feature data, one blank row,
    // next flow, and so on.
    if (selectedMainFlow === "all" && isAllInnerEquipment) {
      MAIN_FLOW_OPTIONS.forEach((flow) => {
        const equipments = getInnerEquipmentForFlow(flow.key);

        const flowSections = [];

        equipments.forEach((equipment) => {
          const equipmentRows = scopedSourceData
            .filter((row) => row.equipment === equipment.key)
            .filter(matchesSelectedPeriod);

          if (!equipmentRows.length) return;

          const exportedRows = buildFlowWiseExportRows(
            equipmentRows,
            [equipment],
            selectedPeriod,
            selectedDate,
            selectedMonth,
          );

          if (!exportedRows.length) return;

          const featureColumns = getFlowFeatureColumns(equipment);

          // Equipment name first, then only that equipment's monitoring fields.
          flowSections.push([equipment.label]);
          flowSections.push([
            periodHeading,
            ...featureColumns.map(([heading]) => heading),
          ]);

          exportedRows.forEach(({ periodValue, sourceRow }) => {
            flowSections.push([
              periodValue,
              ...featureColumns.map(([, accessor]) =>
                accessor(sourceRow) ?? "",
              ),
            ]);
          });

          // One blank row after every equipment section.
          flowSections.push([]);
        });

        if (!flowSections.length) return;

        // One blank row before each new flow except the first.
        if (csvRows.length) {
          csvRows.push([]);
        }

        // Flow name clearly separated from its equipment sections.
        csvRows.push([flow.label]);
        csvRows.push([]);

        // Remove only the final equipment separator before the next flow.
        while (
          flowSections.length &&
          flowSections[flowSections.length - 1].length === 0
        ) {
          flowSections.pop();
        }

        csvRows.push(...flowSections);
      });

      fileLabel = "All-Flows";
    } else {
      const flow =
        MAIN_FLOW_OPTIONS.find((item) => item.key === selectedMainFlow) ||
        getMainFlowForEquipment(EQUIPMENT_BY_KEY[selectedEquipment]);

      if (!flow) return;

      const equipments = isAllInnerEquipment
        ? innerEquipmentOptions
        : [
            EQUIPMENT_BY_KEY[selectedEquipment] ||
              innerEquipmentOptions[0],
          ].filter(Boolean);

      csvRows = buildCsvFlowSection(flow, equipments);
      fileLabel = isAllInnerEquipment
        ? flow.label
        : selectedEquipmentLabel;
    }

    if (!csvRows.length) return;

    const csvLines = csvRows.map((row) =>
      row.map(escapeCsv).join(","),
    );

    const blob = new Blob(["\uFEFF" + csvLines.join("\r\n")], {
      type: "text/csv;charset=utf-8;",
    });

    const safeName = String(fileLabel || "bms")
      .replace(/[^a-zA-Z0-9-_]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${safeName || "bms"}-${selectedPeriod}-monitoring.csv`;

    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  const downloadJson = () => {
    if (!canDownloadReports) return;
    const report = {
      generatedAt: new Date().toISOString(),
      filters: {
        equipment: selectedEquipment,
        equipmentLabel: selectedEquipmentLabel,
        flowGroup: isAllInnerEquipment
          ? selectedMainFlowLabel
          : EQUIPMENT_BY_KEY[selectedEquipment]?.group || "",
        period: selectedPeriod,
        selectedDate,
        selectedMonth,
        fromTime,
        toTime,
        customStart,
        customEnd,
      },
      summary,
      readings: filteredData,
    };

    triggerDownload(
      new Blob([JSON.stringify(report, null, 2)], {
        type: "application/json",
      }),
      `power-analytics-${selectedEquipment}-${selectedPeriod}.json`,
    );
  };


  const downloadExcel = () => {
    if (!canDownloadReports) return;

    const matchesSelectedPeriod = (row) => {
      const rowDate = row.timestamp.slice(0, 10);
      const rowTime = row.timestamp.slice(11, 16);

      if (selectedPeriod === "hourly") {
        return (
          rowDate === selectedDate &&
          rowTime >= fromTime &&
          rowTime <= toTime
        );
      }

      if (selectedPeriod === "daily") {
        return rowDate === selectedDate;
      }

      if (selectedPeriod === "weekly") {
        // Weekly report = exactly 7 calendar days ending on selectedDate.
        // This avoids a "weekly" report showing only one day when the
        // selected date is at the beginning of the current week.
        const end = new Date(`${selectedDate}T00:00:00`);
        const start = new Date(end);
        start.setDate(end.getDate() - 6);

        const current = new Date(`${rowDate}T00:00:00`);
        return current >= start && current <= end;
      }

      if (selectedPeriod === "monthly") {
        return rowDate.slice(0, 7) === selectedMonth;
      }

      if (selectedPeriod === "custom") {
        if (customStart && new Date(row.timestamp) < new Date(customStart)) {
          return false;
        }

        if (customEnd && new Date(row.timestamp) > new Date(customEnd)) {
          return false;
        }

        return true;
      }

      return true;
    };

    const reportRange =
      selectedPeriod === "monthly"
        ? selectedMonth
        : selectedPeriod === "weekly"
          ? (() => {
              const end = new Date(`${selectedDate}T00:00:00`);
              const start = new Date(end);
              start.setDate(end.getDate() - 6);
              return `${formatDateKey(start)} to ${formatDateKey(end)}`;
            })()
          : selectedPeriod === "custom"
            ? `${customStart || "Start"} to ${customEnd || "End"}`
            : selectedDate;

    const workbook = XLSX.utils.book_new();

    const addFlowSheet = (flow, equipments) => {
      const equipmentKeys = equipments.map((equipment) => equipment.key);
      const flowRows = scopedSourceData
        .filter((row) => equipmentKeys.includes(row.equipment))
        .filter(matchesSelectedPeriod);

      if (!flowRows.length) return;

      const exportedRows = buildFlowWiseExportRows(
        flowRows,
        equipments,
        selectedPeriod,
        selectedDate,
        selectedMonth,
      );

      if (!exportedRows.length) return;

      const featureColumnNames = [];
      const featureColumnMap = new Map();

      equipments.forEach((equipment) => {
        getFlowFeatureColumns(equipment).forEach(([heading, accessor]) => {
          if (!featureColumnMap.has(heading)) {
            featureColumnMap.set(heading, accessor);
            featureColumnNames.push(heading);
          }
        });
      });

      const periodHeading =
        selectedPeriod === "hourly" ? "Time" : "Date";

      const metadata = [
        ["Flow", flow.label],
        ["Report", selectedPeriod],
        ["Date / Range", reportRange],
        ["Equipment Count", equipments.length],
        [],
      ];

      const header = [
        "Equipment",
        periodHeading,
        ...featureColumnNames,
      ];

      const body = exportedRows.map(({ equipment, periodValue, sourceRow }) => {
        const equipmentColumns = new Map(
          getFlowFeatureColumns(equipment).map(([heading, accessor]) => [
            heading,
            accessor,
          ]),
        );

        return [
          equipment.label,
          periodValue,
          ...featureColumnNames.map((heading) => {
            const accessor = equipmentColumns.get(heading);
            return accessor ? accessor(sourceRow) ?? "" : "";
          }),
        ];
      });

      const worksheet = XLSX.utils.aoa_to_sheet([
        ...metadata,
        header,
        ...body,
      ]);

      worksheet["!freeze"] = { xSplit: 0, ySplit: 6 };
      worksheet["!autofilter"] = {
        ref: `A6:${XLSX.utils.encode_col(header.length - 1)}${body.length + 6}`,
      };

      worksheet["!cols"] = header.map((heading, index) => ({
        wch:
          index === 0
            ? 30
            : index === 1
              ? 18
              : Math.max(12, Math.min(22, String(heading).length + 4)),
      }));

      const safeSheetName = flow.label
        .replace(/[\\/?*[\]:]/g, "-")
        .slice(0, 31);

      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        safeSheetName || "Flow",
      );
    };

    if (selectedMainFlow === "all" && isAllInnerEquipment) {
      // ALL DATA DOWNLOAD:
      // Flow -> equipment -> that equipment's monitoring fields.
      // A blank row separates every equipment, so data never appears
      // as one continuous mixed table.
      const allRows = [];

      MAIN_FLOW_OPTIONS.forEach((flow) => {
        const equipments = getInnerEquipmentForFlow(flow.key);
        const flowRows = [];

        equipments.forEach((equipment) => {
          const equipmentRows = scopedSourceData
            .filter((row) => row.equipment === equipment.key)
            .filter(matchesSelectedPeriod);

          if (!equipmentRows.length) return;

          const exportedRows = buildFlowWiseExportRows(
            equipmentRows,
            [equipment],
            selectedPeriod,
            selectedDate,
            selectedMonth,
          );

          if (!exportedRows.length) return;

          const featureColumns = getFlowFeatureColumns(equipment);

          const periodHeading =
            selectedPeriod === "hourly" ? "Time" : "Date";

          // Equipment title
          flowRows.push([equipment.label]);

          // Only this equipment's actual monitoring features
          flowRows.push([
            periodHeading,
            ...featureColumns.map(([heading]) => heading),
          ]);

          exportedRows.forEach(({ periodValue, sourceRow }) => {
            flowRows.push([
              periodValue,
              ...featureColumns.map(([, accessor]) =>
                accessor(sourceRow) ?? "",
              ),
            ]);
          });

          // Exactly one blank row between equipment sections.
          flowRows.push([]);
        });

        while (
          flowRows.length &&
          flowRows[flowRows.length - 1].length === 0
        ) {
          flowRows.pop();
        }

        if (!flowRows.length) return;

        // Exactly one blank row between flows.
        if (allRows.length) {
          allRows.push([]);
        }

        allRows.push([flow.label]);
        allRows.push([]);
        allRows.push(...flowRows);
      });

      if (!allRows.length) return;

      const worksheet = XLSX.utils.aoa_to_sheet(allRows);

      const maxColumnCount = allRows.reduce(
        (max, row) => Math.max(max, row.length),
        0,
      );

      worksheet["!cols"] = Array.from(
        { length: Math.max(2, maxColumnCount) },
        (_, index) => ({
          wch: index === 0 ? 30 : 20,
        }),
      );

      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "All Flows",
      );
    } else {
      const flow =
        MAIN_FLOW_OPTIONS.find((item) => item.key === selectedMainFlow) ||
        getMainFlowForEquipment(EQUIPMENT_BY_KEY[selectedEquipment]);

      if (!flow) return;

      const equipments = isAllInnerEquipment
        ? innerEquipmentOptions
        : [
            EQUIPMENT_BY_KEY[selectedEquipment] ||
              innerEquipmentOptions[0],
          ].filter(Boolean);

      addFlowSheet(flow, equipments);
    }

    if (!workbook.SheetNames.length) return;

    const fileLabel =
      selectedMainFlow === "all" && isAllInnerEquipment
        ? "All-Flows-One-Sheet"
        : selectedMainFlowLabel.replace(/[^a-zA-Z0-9-_]+/g, "-");

    XLSX.writeFile(
      workbook,
      `${fileLabel || "BMS"}-${selectedPeriod}-flow-wise-monitoring.xlsx`,
    );
  };

  const resetFilters = () => {
    setSelectedMainFlow("source");
    setSelectedEquipment(
      getInnerEquipmentForFlow("source")[0]?.key || "source",
    );
    setSelectedPeriod("daily");
    setSelectedDate(formatDateKey(new Date()));
    setSelectedMonth(getCurrentMonth());
    setFromTime("00:00");
    setToTime("23:59");
    setCustomStart("");
    setCustomEnd("");
  };

  if (!currentUser) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#EEF3F8] px-6 py-10">
        <section className="w-full max-w-md border-2 border-red-400 bg-[#081F5C] p-8 text-center text-white">
          <h1 className="text-2xl font-black">
            User Session Required
          </h1>

          <p className="mt-3 text-sm leading-6 text-blue-200">
            Please sign in with an active User account to open the analytical overview.
          </p>

          <button
            type="button"
            onClick={() => {
              tempApi.logout();
              window.location.href = "/auth";
            }}
            className="mt-6 inline-flex items-center justify-center border border-cyan-400 bg-[#004AAD] px-6 py-2.5 text-sm font-black text-white hover:bg-[#003B8A]"
          >
            Go to Login
          </button>
        </section>
      </main>
    );
  }

  if (!hasOverviewDataScope) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#EEF3F8] px-6 py-10">
        <section className="w-full max-w-lg border-2 border-amber-400 bg-[#081F5C] p-8 text-center text-white">
          <h1 className="text-2xl font-black">No access scope assigned</h1>
          <p className="mt-3 text-sm leading-6 text-blue-200">
            No Floor or Zone access has been assigned.
          </p>
          <Link
            to="/dashboard"
            className="mt-6 inline-flex items-center justify-center border border-cyan-400 bg-[#004AAD] px-6 py-2.5 text-sm font-black text-white hover:bg-[#003B8A]"
          >
            Back to Dashboard
          </Link>
        </section>
      </main>
    );
  }

  return (
    <div className="flex min-h-[100dvh] w-full min-w-0 flex-col overflow-x-hidden bg-[radial-gradient(circle_at_50%_0%,rgba(0,174,239,0.07),transparent_28%),linear-gradient(180deg,#F7FAFD_0%,#EEF5FA_100%)] text-[#06224F]">
      <header className="sticky top-0 z-[1000] shrink-0 border-b-4 border-[#004AAD] bg-[#081F5C] px-3 py-2.5 text-white shadow-[0_8px_30px_rgba(3,23,65,0.20)] sm:px-4">
        <div className="flex w-full min-w-0 flex-col gap-2.5 xl:flex-row xl:items-center xl:justify-between">
          <Link to="/dashboard" className="flex min-w-0 items-center no-underline">
            <div className="min-w-0">
              <h1 className="truncate text-[clamp(18px,2vw,26px)] font-semibold uppercase leading-none tracking-[0.18em] text-white">
                ARCOT
                <span className="ml-2 text-[#67E8F9]">IIoT 1.0</span>
              </h1>

              <span className="mt-1 hidden text-[9px] font-medium uppercase tracking-[0.35em] text-blue-300 sm:block">
                Industrial Internet of Things
              </span>
            </div>

            <div className="ml-5 hidden h-[54px] border-l border-[#004AAD] sm:block" />

            <img
              src={prestigeLogo}
              alt="Prestige Group"
              className="ml-5 hidden h-[52px] w-[100px] object-contain sm:block"
            />
          </Link>

          <div className="grid w-full min-w-0 grid-cols-2 gap-2 sm:grid-cols-4 xl:flex xl:w-auto xl:flex-wrap xl:items-center">
            <Link
              to="/dashboard"
              replace
              className="flex h-9 w-full items-center justify-center border border-cyan-400 bg-[#004AAD] px-4 text-[10px] font-black uppercase tracking-[0.15em] text-white transition hover:bg-[#0058D6] sm:w-auto"
            >
              Back
            </Link>

            <div className="hidden border border-[#004AAD] bg-[#05143C] px-3 py-1.5 lg:block">
              <p className="max-w-[190px] truncate text-[9px] font-bold text-cyan-200">
                {currentUser.name}
              </p>

              <p className="max-w-[190px] truncate text-[7px] uppercase tracking-[0.08em] text-blue-300">
                {currentUser.designation || "USER"} ·{" "}
                {currentUser.companyName || "Assigned Company"}
              </p>
            </div>

            <div className="hidden items-center gap-2 border border-[#004AAD] bg-[#05143C] px-3 py-1.5 md:flex">
              <span className="h-2 w-2 bg-emerald-400" />

              <span className="text-[10px] font-bold tracking-[0.15em] text-white">
                BLE Connected
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                tempApi.logout();
                window.location.href = "/auth";
              }}
              className="h-9 w-full border border-red-400 bg-red-600 px-4 text-[10px] font-black uppercase tracking-[0.15em] text-white transition hover:bg-red-700 sm:w-auto"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <style>{`
        .overview-main-grid {
          align-content: start;
        }

        @media (min-width: 1024px) and (max-width: 1535px) {
          .overview-main-grid {
            gap: 10px;
          }
        }

        @media (min-width: 1024px) and (max-height: 820px) {
          .overview-main-grid {
            padding-top: 10px;
            padding-bottom: 14px;
          }
        }

        @media (max-width: 639px) {
          .overview-main-grid {
            padding-left: 10px;
            padding-right: 10px;
          }
        }

        @media print {
          header,
          button,
          select,
          input {
            display: none !important;
          }

          body {
            background: white !important;
          }

          main {
            max-width: none !important;
            padding: 0 !important;
          }

          .print-safe {
            box-shadow: none !important;
            break-inside: avoid;
          }
        }
      `}</style>

      <main className="overview-main-grid mx-auto grid w-full min-w-0 max-w-[1720px] grid-cols-1 gap-3 overflow-x-hidden px-3 py-3 sm:px-4 md:px-5 lg:px-6 2xl:px-8">
        <section className="grid min-w-0 grid-cols-1 gap-3 xl:grid-cols-12">
          <div className="relative col-span-12 min-w-0 overflow-hidden rounded-[15px] border border-[#0A326B] bg-[linear-gradient(135deg,#041A3E_0%,#073066_56%,#0A5E91_100%)] px-4 py-3.5 text-white shadow-[0_18px_42px_rgba(8,31,92,0.22)] xl:col-span-4">
            <div className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full border border-white/10 bg-white/[0.04]" />
            <div className="pointer-events-none absolute -bottom-24 left-16 h-52 w-52 rounded-full bg-[#17A8DB]/15 blur-3xl" />

     <div className="relative flex min-h-[132px] min-w-0 items-center justify-between gap-4 sm:min-h-[148px] xl:h-full">
  <div>
    <h2 className="text-[22px] font-bold leading-tight tracking-[-0.03em] text-white">
      Operational Analytics
      <span className="mt-1 block text-[18px] font-semibold text-[#5DD9FF]">
        Monitoring Workspace
      </span>
    </h2>

    <p className="mt-3 max-w-[320px] truncate text-[9px] font-semibold uppercase tracking-[0.08em] text-blue-200">
      {currentUser.companyName || "Assigned Company"} ·{" "}
      {currentUser.accessType || "BUILDING"}:{" "}
      {currentUser.accessName || "Assigned Access"}
    </p>
  </div>

  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] border border-white/15 bg-white/[0.08] text-[#5DD9FF] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
    <BarChart3 size={24} />
  </div>
</div>
          </div>

       <Card className="print-safe col-span-12 flex min-h-0 min-w-0 flex-col overflow-hidden p-3.5 xl:col-span-8">
  <div className="flex shrink-0 min-w-0 flex-col gap-3 border-b border-[#E3ECF5] pb-2.5 xl:flex-row xl:items-center xl:justify-between">
    <div className="flex items-center gap-3.5">
      <div className="flex h-11 w-11 items-center justify-center rounded-[12px] border border-[#D6E4F2] bg-[#EDF5FA] text-[#1B73C9]">
        <Gauge size={21} strokeWidth={2.2} />
      </div>

      <div>
        <h3 className="text-[15px] font-bold text-[#06224F]">
          Analysis Controls
        </h3>

        <p className="mt-1 text-[10px] leading-relaxed text-[#7D91A7]">
          Select the equipment and reporting window.
        </p>
      </div>
    </div>

    <div className="grid w-full min-w-0 grid-cols-2 gap-2 sm:grid-cols-4 2xl:w-auto 2xl:shrink-0">
      <button
        type="button"
        onClick={downloadCsv}
        disabled={!canDownloadReports}
        title={
          canDownloadReports
            ? "Download CSV report"
            : "Download permission is not assigned"
        }
        className={`inline-flex h-10 min-w-0 items-center justify-center gap-2 whitespace-nowrap rounded-[10px] px-3 text-[9px] font-bold uppercase tracking-[0.1em] transition ${
          canDownloadReports
            ? "bg-[#1B73C9] text-white shadow-[0_8px_18px_rgba(37,99,235,0.2)] hover:bg-[#155FA8]"
            : "cursor-not-allowed bg-slate-200 text-slate-400"
        }`}
      >
        <Download size={15} />
        CSV
      </button>

      <button
        type="button"
        onClick={downloadExcel}
        disabled={!canDownloadReports}
        title={
          canDownloadReports
            ? "Download flow-wise Excel workbook with equipment-specific monitoring features"
            : "Download permission is not assigned"
        }
        className={`inline-flex h-10 min-w-0 items-center justify-center gap-2 whitespace-nowrap rounded-[10px] border px-3 text-[9px] font-bold uppercase tracking-[0.1em] transition ${
          canDownloadReports
            ? "border-[#BEE8D4] bg-[#ECFDF5] text-[#15805F] hover:border-[#16A34A] hover:bg-[#DFF8EA]"
            : "cursor-not-allowed border-slate-300 bg-slate-100 text-slate-400"
        }`}
      >
        <Download size={15} />
        Realtime Excel
      </button>

      <button
        type="button"
        onClick={downloadJson}
        disabled={!canDownloadReports}
        title={
          canDownloadReports
            ? "Download JSON report"
            : "Download permission is not assigned"
        }
        className={`inline-flex h-10 min-w-0 items-center justify-center gap-2 whitespace-nowrap rounded-[10px] border px-3 text-[9px] font-bold uppercase tracking-[0.1em] transition ${
          canDownloadReports
            ? "border-[#CCDCEB] bg-white text-[#416483] hover:border-[#1B73C9] hover:text-[#1B73C9]"
            : "cursor-not-allowed border-slate-300 bg-slate-100 text-slate-400"
        }`}
      >
        <FileJson size={15} />
        JSON
      </button>

      <button
        type="button"
        onClick={() => {
          if (canDownloadReports) {
            window.print();
          }
        }}
        disabled={!canDownloadReports}
        title={
          canDownloadReports
            ? "Print analytics"
            : "Download permission is not assigned"
        }
        className={`hidden h-10 w-10 items-center justify-center rounded-[10px] border transition sm:flex ${
          canDownloadReports
            ? "border-[#CCDCEB] bg-white text-[#657B92] hover:border-[#06224F] hover:text-[#06224F]"
            : "cursor-not-allowed border-slate-300 bg-slate-100 text-slate-400"
        }`}
        aria-label="Print analytics"
      >
        <Printer size={16} />
      </button>
    </div>
  </div>

  <div className="mt-3 grid min-w-0 grid-cols-1 items-end gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7">
    <label className="flex w-full min-w-0 max-w-full flex-col gap-1.5">
      <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#8192A7]">
        Main Equipment
      </span>

      <select
        aria-label="Select main equipment"
        value={selectedMainFlow}
        onChange={(event) => {
          const nextFlow = event.target.value;
          const nextOptions = getInnerEquipmentForFlow(nextFlow);

          setSelectedMainFlow(nextFlow);
          setSelectedEquipment(
            nextFlow === "all"
              ? "all"
              : nextOptions[0]?.key || nextFlow,
          );
        }}
        className="h-10 w-full min-w-0 max-w-full truncate rounded-[9px] border border-[#C6D8E9] bg-[#FAFCFE] px-3 text-[11px] font-semibold text-[#06224F] outline-none transition focus:border-[#1B73C9] focus:ring-2 focus:ring-[#1B73C9]/10"
      >
        {MAIN_FLOW_OPTIONS.map((flow) => (
          <option key={flow.key} value={flow.key}>
            {flow.label}
          </option>
        ))}
        <option value="all">All</option>
      </select>
    </label>

    <label className="flex w-full min-w-0 max-w-full flex-col gap-1.5">
      <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#8192A7]">
        Inner Equipment
      </span>

      <select
        aria-label="Select inner equipment"
        value={selectedEquipment}
        onChange={(event) => setSelectedEquipment(event.target.value)}
        className="h-10 w-full min-w-0 max-w-full truncate rounded-[9px] border border-[#C6D8E9] bg-[#FAFCFE] px-3 text-[11px] font-semibold text-[#06224F] outline-none transition focus:border-[#1B73C9] focus:ring-2 focus:ring-[#1B73C9]/10"
      >
        {innerEquipmentOptions.map((equipment) => (
          <option key={equipment.key} value={equipment.key}>
            {equipment.label}
          </option>
        ))}
        <option value="all">All</option>
      </select>
    </label>

    <label className="flex w-full min-w-0 max-w-full flex-col gap-1.5">
      <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#8192A7]">
        Period
      </span>

      <select
        aria-label="Select reporting period"
        value={selectedPeriod}
        onChange={(event) => setSelectedPeriod(event.target.value)}
        className="h-10 w-full min-w-0 max-w-full truncate rounded-[9px] border border-[#C6D8E9] bg-[#FAFCFE] px-3 text-[11px] font-semibold text-[#06224F] outline-none transition focus:border-[#1B73C9] focus:ring-2 focus:ring-[#1B73C9]/10"
      >
        <option value="hourly">Hourly</option>
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
        <option value="custom">Custom Range</option>
      </select>
    </label>

    {(selectedPeriod === "hourly" || selectedPeriod === "daily" || selectedPeriod === "weekly") && (
      <label className="flex w-full min-w-0 max-w-full flex-col gap-1.5">
        <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#8192A7]">
          Date
        </span>

        <input
          type="date"
          value={selectedDate}
          onChange={(event) => setSelectedDate(event.target.value)}
          className="h-10 w-full min-w-0 max-w-full truncate rounded-[9px] border border-[#C6D8E9] bg-[#FAFCFE] px-3 text-[11px] font-semibold text-[#06224F] outline-none transition focus:border-[#1B73C9] focus:ring-2 focus:ring-[#1B73C9]/10"
        />
      </label>
    )}

    {selectedPeriod === "monthly" && (
      <label className="flex w-full min-w-0 max-w-full flex-col gap-1.5">
        <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#8192A7]">
          Month
        </span>

        <input
          type="month"
          value={selectedMonth}
          onChange={(event) => setSelectedMonth(event.target.value)}
          className="h-10 w-full min-w-0 max-w-full truncate rounded-[9px] border border-[#C6D8E9] bg-[#FAFCFE] px-3 text-[11px] font-semibold text-[#06224F] outline-none transition focus:border-[#1B73C9] focus:ring-2 focus:ring-[#1B73C9]/10"
        />
      </label>
    )}

    {(selectedPeriod === "hourly" || selectedPeriod === "daily") && (
      <>
        <label className="flex w-full min-w-0 max-w-full flex-col gap-1.5">
          <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#8192A7]">
            From
          </span>

          <input
            type="time"
            value={fromTime}
            onChange={(event) => setFromTime(event.target.value)}
            className="h-10 w-full min-w-0 max-w-full truncate rounded-[9px] border border-[#C6D8E9] bg-[#FAFCFE] px-3 text-[11px] font-semibold text-[#06224F] outline-none transition focus:border-[#1B73C9] focus:ring-2 focus:ring-[#1B73C9]/10"
          />
        </label>

        <label className="flex w-full min-w-0 max-w-full flex-col gap-1.5">
          <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#8192A7]">
            To
          </span>

          <input
            type="time"
            value={toTime}
            onChange={(event) => setToTime(event.target.value)}
            className="h-10 w-full min-w-0 max-w-full truncate rounded-[9px] border border-[#C6D8E9] bg-[#FAFCFE] px-3 text-[11px] font-semibold text-[#06224F] outline-none transition focus:border-[#1B73C9] focus:ring-2 focus:ring-[#1B73C9]/10"
          />
        </label>
      </>
    )}

    {selectedPeriod === "custom" && (
      <>
        <label className="flex min-w-0 flex-col gap-1.5 md:col-span-2">
          <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#8192A7]">
            Range Start
          </span>

          <input
            type="datetime-local"
            value={customStart}
            onChange={(event) => setCustomStart(event.target.value)}
            className="h-10 w-full min-w-0 max-w-full truncate rounded-[9px] border border-[#C6D8E9] bg-[#FAFCFE] px-3 text-[11px] font-semibold text-[#06224F] outline-none transition focus:border-[#1B73C9] focus:ring-2 focus:ring-[#1B73C9]/10"
          />
        </label>

        <label className="flex min-w-0 flex-col gap-1.5 md:col-span-2">
          <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#8192A7]">
            Range End
          </span>

          <input
            type="datetime-local"
            value={customEnd}
            onChange={(event) => setCustomEnd(event.target.value)}
            className="h-10 w-full min-w-0 max-w-full truncate rounded-[9px] border border-[#C6D8E9] bg-[#FAFCFE] px-3 text-[11px] font-semibold text-[#06224F] outline-none transition focus:border-[#1B73C9] focus:ring-2 focus:ring-[#1B73C9]/10"
          />
        </label>
      </>
    )}

    <button
      type="button"
      onClick={resetFilters}
      className="mt-auto inline-flex h-10 w-full min-w-0 items-center justify-center gap-2 whitespace-nowrap rounded-[9px] border border-[#C6D8E9] bg-[#F7FAFD] px-3 text-[9px] font-bold uppercase tracking-[0.1em] text-[#657B92] transition hover:border-[#1B73C9] hover:bg-white hover:text-[#1B73C9]"
    >
      <RefreshCw size={15} />
      Reset
    </button>
  </div>
</Card>
        </section>

        <section className="grid min-w-0 grid-cols-1 gap-2.5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
          {selectedEquipment !== "all" && selectedMonitoringCards.length ? (
            <>
              {selectedMonitoringCards.slice(0, 5).map((item, index) => (
                <MetricCard
                  key={item.label}
                  label={item.label}
                  value={item.value ?? "-"}
                  tone={
                    index === 0
                      ? "blue"
                      : index === 1
                        ? "amber"
                        : index === 2
                          ? "cyan"
                          : index === 3
                            ? "green"
                            : "blue"
                  }
                  icon={
                    item.label.includes("Temp")
                      ? Activity
                      : item.label.includes("Load") ||
                          item.label.includes("Level") ||
                          item.label.includes("Battery")
                        ? Gauge
                        : item.label.includes("Voltage")
                          ? Zap
                          : item.label.includes("Health") ||
                              item.label.includes("Relay")
                            ? ShieldCheck
                            : BarChart3
                  }
                  trend={
                    index === 0 && selectedMonitoringStatus
                      ? selectedMonitoringStatus
                      : undefined
                  }
                />
              ))}

              {Array.from({
                length: Math.max(
                  0,
                  5 - selectedMonitoringCards.slice(0, 5).length,
                ),
              }).map((_, index) => (
                <MetricCard
                  key={`empty-monitor-${index}`}
                  label="Monitoring"
                  value="-"
                  tone="blue"
                  icon={Activity}
                />
              ))}
            </>
          ) : (
            <>
              <MetricCard
                label="Consumed Energy"
                value={summary.totalEnergy.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}
                unit="kWh"
                tone="blue"
                icon={Zap}
                trend="Live"
              />

              <MetricCard
                label="Peak Load"
                value={summary.peakLoad.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}
                unit="kW"
                tone="amber"
                icon={TrendingUp}
              />

              <MetricCard
                label="Average Load"
                value={summary.averageLoad.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}
                unit="kW"
                tone="cyan"
                icon={Activity}
              />

              <MetricCard
                label="Distribution Loss"
                value={summary.totalLoss.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}
                unit="kW"
                tone="red"
                icon={ArrowDownToLine}
              />

              <MetricCard
                label="Efficiency"
                value={`${summary.efficiency.toFixed(1)}%`}
                tone="green"
                icon={ShieldCheck}
              />
            </>
          )}
        </section>

        <div className="flex min-h-[42px] flex-col gap-2 rounded-[11px] border border-[#D3E2EF] bg-white px-1.5 py-1.5 shadow-[0_8px_22px_rgba(8,31,92,0.06)] sm:flex-row sm:items-center sm:justify-between">
          <div className="grid grid-cols-2 gap-1 sm:flex sm:items-center">
            <button
              type="button"
              onClick={() => setActiveWorkspace("analytics")}
              className={`inline-flex items-center gap-2 rounded-[9px] px-4 py-2 text-[8px] font-bold uppercase tracking-[0.1em] transition ${
                activeWorkspace === "analytics"
                  ? "bg-[#06224F] text-white shadow-[0_8px_18px_rgba(8,31,92,0.18)]"
                  : "text-[#687F99] hover:bg-[#EDF5FA] hover:text-[#06224F]"
              }`}
            >
              <BarChart3 size={13} />
              Analytics
            </button>

            <button
              type="button"
              onClick={() => setActiveWorkspace("readings")}
              className={`inline-flex items-center gap-2 rounded-[9px] px-4 py-2 text-[8px] font-bold uppercase tracking-[0.1em] transition ${
                activeWorkspace === "readings"
                  ? "bg-[#06224F] text-white shadow-[0_8px_18px_rgba(8,31,92,0.18)]"
                  : "text-[#687F99] hover:bg-[#EDF5FA] hover:text-[#06224F]"
              }`}
            >
              <Layers3 size={13} />
              Detailed Readings
            </button>
          </div>

          <div className="hidden items-center gap-2 pr-2 md:flex">
            <span className="h-2 w-2 rounded-full bg-[#16A34A] shadow-[0_0_0_4px_rgba(22,163,74,0.10)]" />
            <span className="text-[8px] font-bold uppercase tracking-[0.1em] text-[#15805F]">
              {filteredData.length.toLocaleString()} records loaded
            </span>
          </div>
        </div>

        {activeWorkspace === "analytics" ? (
          canViewReports ? (
            <section className="grid min-w-0 grid-cols-1 gap-2.5 xl:grid-cols-12">
            <Card className="print-safe flex min-h-[260px] min-w-0 flex-col overflow-hidden p-3.5 xl:col-span-8">
              <SectionTitle
                title={`${selectedEquipmentLabel} Load Trend`}
                subtitle="Consumption trend across the selected period."
                icon={TrendingUp}
              />

              <div className="flex min-h-[220px] flex-1 items-stretch rounded-[12px] border border-[#D8E6F2] bg-[linear-gradient(180deg,#FAFCFE_0%,#F6FAFE_100%)] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] sm:min-h-[280px] lg:min-h-0">
                <TrendChart rows={filteredData} />
              </div>
            </Card>

            <div className="grid min-h-0 min-w-0 grid-cols-1 gap-2.5 sm:grid-cols-2 xl:col-span-4 xl:grid-cols-1">
              <Card className="print-safe flex min-h-[180px] flex-col p-3 lg:h-full lg:min-h-0">
                <SectionTitle
                  title="Electrical Quality"
                  subtitle="Average electrical conditions for the selected data."
                  icon={Gauge}
                />

                <div className="grid min-h-0 flex-1 grid-cols-3 items-stretch gap-2">
                  <div className="flex min-h-0 flex-col items-center justify-center rounded-[14px] border border-[#D8E6F2] bg-[linear-gradient(180deg,#FFFFFF_0%,#F5F9FC_100%)] p-2 text-center shadow-[0_8px_18px_rgba(8,31,92,0.05)]">
                    <p className="text-[8px] uppercase tracking-[0.1em] text-[#8192A7]">
                      Voltage
                    </p>
                    <h3 className="mt-2 text-[18px] font-semibold text-[#1B73C9]">
                      {summary.averageVoltage.toFixed(1)}
                    </h3>
                    <p className="mt-1 text-[8px] text-[#8192A7]">V</p>
                  </div>

                  <div className="flex min-h-0 flex-col items-center justify-center rounded-[14px] border border-[#D8E6F2] bg-[linear-gradient(180deg,#FFFFFF_0%,#F5F9FC_100%)] p-2 text-center shadow-[0_8px_18px_rgba(8,31,92,0.05)]">
                    <p className="text-[8px] uppercase tracking-[0.1em] text-[#8192A7]">
                      Current
                    </p>
                    <h3 className="mt-2 text-[18px] font-semibold text-[#0E86B7]">
                      {summary.averageCurrent.toFixed(1)}
                    </h3>
                    <p className="mt-1 text-[8px] text-[#8192A7]">A</p>
                  </div>

                  <div className="flex min-h-0 flex-col items-center justify-center rounded-[14px] border border-[#D8E6F2] bg-[linear-gradient(180deg,#FFFFFF_0%,#F5F9FC_100%)] p-2 text-center shadow-[0_8px_18px_rgba(8,31,92,0.05)]">
                    <p className="text-[8px] uppercase tracking-[0.1em] text-[#8192A7]">
                      PF
                    </p>
                    <h3 className="mt-2 text-[18px] font-semibold text-[#15805F]">
                      {summary.averagePowerFactor.toFixed(2)}
                    </h3>
                    <p className="mt-1 text-[8px] text-[#8192A7]">Average</p>
                  </div>
                </div>
              </Card>

              <Card className="print-safe flex min-h-[180px] flex-col p-3 lg:h-full lg:min-h-0">
                <SectionTitle
                  title="Hourly Consumption"
                  subtitle="Recent energy consumption blocks."
                  icon={BarChart3}
                />
                <div className="min-h-0 flex-1 overflow-hidden px-1 pt-1">
                  <EnergyBars rows={filteredData} />
                </div>
              </Card>
            </div>
            </section>
          ) : (
            <RestrictedState
              title="Analytics access has not been assigned."
              message="Overview remains available. Ask an Admin to assign Analytics access for trend charts and historical analysis."
              icon={BarChart3}
            />
          )
        ) : (
          canViewLiveReadings ? (
            <section className="min-w-0">
            <Card className="print-safe flex min-h-[360px] min-w-0 max-w-full flex-col overflow-hidden p-3.5">
              <SectionTitle
                title="Detailed Analytical Readings"
                subtitle={`${filteredData.length.toLocaleString()} readings match the selected filters.`}
                icon={Layers3}
              />

              <div className="mt-3 min-w-0 max-w-full space-y-3 overflow-x-hidden lg:hidden">
                {filteredData.length === 0 ? (
                  <p className="rounded-[12px] border border-[#E2EBF4] px-3 py-8 text-center text-[11px] font-semibold text-[#687F99]">
                    No monitoring readings are available for the assigned Zones.
                  </p>
                ) : (
                  filteredData.map((row, index) => {
                    const loss = Math.max(
                      0,
                      Number(row.incomingKw) - Number(row.outgoingKw),
                    );

                    return (
                      <article
                        key={`${row.timestamp}-${row.equipment}-${index}`}
                        className="w-full rounded-[12px] border border-[#E2EBF4] bg-white p-3 text-[11px] text-[#5F738D]"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-[8px] font-bold uppercase tracking-[0.1em] text-[#1B73C9]">
                              {row.flowGroup}
                            </p>
                            <h3 className="mt-1 break-words text-sm font-black text-[#06224F]">
                              {row.equipmentLabel}
                            </h3>
                            <p className="mt-1 text-[10px]">
                              {new Date(row.timestamp).toLocaleString()}
                            </p>
                          </div>
                          <span
                            className={`inline-flex shrink-0 rounded-full border px-2.5 py-1 text-[7px] font-bold uppercase tracking-[0.08em] ${
                              row.status === "Normal"
                                ? "border-[#BEE8D4] bg-[#E8F5EE] text-[#15805F]"
                                : "border-[#F4D3B2] bg-[#FFF5DD] text-[#B7791F]"
                            }`}
                          >
                            {row.status}
                          </span>
                        </div>

                        <dl className="mt-3 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
                          {getFlowFeatureColumns(
                            EQUIPMENT_BY_KEY[row.equipment],
                          ).map(([label, accessor]) => {
                            const value = accessor(row);

                            return (
                              <div key={label}>
                                <dt className="text-[8px] font-bold uppercase tracking-[0.1em] text-[#8192A7]">
                                  {label}
                                </dt>
                                <dd className="mt-1 font-semibold text-[#06224F]">
                                  {value ?? "-"}
                                </dd>
                              </div>
                            );
                          })}
                        </dl>
                      </article>
                    );
                  })
                )}
              </div>

              <div className="hidden min-h-[320px] min-w-0 max-w-full flex-1 overflow-x-auto overflow-y-auto rounded-[12px] border border-[#E2EBF4] lg:block">
                <table className="w-max min-w-full border-collapse">
                  <thead className="sticky top-0 z-10 bg-[#F5F9FC]/95 backdrop-blur">
                    <tr className="border-b border-[#D8E6F2]">
                      {[
                        "Timestamp",
                        "Flow",
                        "Equipment",
                        ...selectedFeatureColumns,
                      ].map((heading) => (
                        <th
                          key={heading}
                          className="whitespace-nowrap px-3 py-2.5 text-left text-[8px] font-bold uppercase tracking-[0.1em] text-[#8192A7]"
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {filteredData.length === 0 ? (
                      <tr>
                        <td
                          colSpan={Math.max(
                            3 + selectedFeatureColumns.length,
                            3,
                          )}
                          className="px-3 py-8 text-center text-[11px] font-semibold text-[#687F99]"
                        >
                          No monitoring readings are available for the assigned Zones.
                        </td>
                      </tr>
                    ) : (
                      filteredData.map((row, index) => (
                        <tr
                          key={`${row.timestamp}-${row.equipment}-${index}`}
                          className="border-b border-[#EDF2F7] transition hover:bg-[#F5F9FC] last:border-b-0"
                        >
                          <td className="whitespace-nowrap px-3 py-2.5 text-[9px] text-[#5F738D]">
                            {new Date(row.timestamp).toLocaleString()}
                          </td>

                          <td className="whitespace-nowrap px-3 py-2.5 text-[9px] font-semibold text-[#1B73C9]">
                            {row.flowGroup}
                          </td>

                          <td className="whitespace-nowrap px-3 py-2.5 text-[9px] font-semibold text-[#06224F]">
                            {row.equipmentLabel}
                          </td>

                          {selectedFeatureColumns.map((heading) => (
                            <td
                              key={heading}
                              className="whitespace-nowrap px-3 py-2.5 text-[9px] text-[#5F738D]"
                            >
                              {getFeatureValueByHeading(row, heading) || "-"}
                            </td>
                          ))}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
            </section>
          ) : (
            <RestrictedState
              title="Live monitoring access has not been assigned."
              message="Overview remains available. Current readings are hidden until Live Monitoring access is assigned."
              icon={Layers3}
            />
          )
        )}
      </main>
    </div>
  );
}
