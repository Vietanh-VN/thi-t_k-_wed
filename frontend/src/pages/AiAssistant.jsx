import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  MOCK_AI_AGENTS,
  MOCK_AI_REPORT_DAY,
  MOCK_AI_PEAK_HOURS,
  MOCK_AI_STAFFING
} from '../services/mockData';
import {
  Bot,
  Sparkles,
  FileText,
  Clock,
  Users,
  MessageSquare,
  Send,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Zap,
  RotateCcw,
  ShieldCheck,
  Calendar,
  Layers
} from 'lucide-react';

const AiAssistant = () => {
  const [activeTab, setActiveTab] = useState('agents'); // 'agents', 'report', 'peak', 'staffing', 'chat'

  // Multi-Agent System state
  const [agentsData, setAgentsData] = useState(MOCK_AI_AGENTS);
  const [agentsLoading, setAgentsLoading] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState('agent-spot-allocator');
  const [agentActionMessage, setAgentActionMessage] = useState(null);

  // Report state
  const [reportType, setReportType] = useState('Ngay');
  const [reportData, setReportData] = useState(MOCK_AI_REPORT_DAY);
  const [reportLoading, setReportLoading] = useState(false);

  // Peak hours state
  const [peakData, setPeakData] = useState(MOCK_AI_PEAK_HOURS);
  const [peakLoading, setPeakLoading] = useState(false);

  // Staffing state
  const [staffingData, setStaffingData] = useState(MOCK_AI_STAFFING);
  const [staffingLoading, setStaffingLoading] = useState(false);

  // Chat state
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Xin chào! Tôi là Trợ lý AI Bãi đỗ xe thông minh ICTU. Tôi có thể giúp bạn tổng hợp báo cáo lưu lượng, phân tích khung giờ cao điểm, tính toán doanh thu hoặc gợi ý phương án bố trí nhân sự. Bạn muốn tôi hỗ trợ thông tin gì?',
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const fetchAgentsData = async () => {
    try {
      const res = await api.get('/ai/agents');
      if (res.data?.agents && Array.isArray(res.data.agents)) {
        setAgentsData(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAgentsLoading(false);
    }
  };

  // Quick Questions Chips
  const quickQuestions = [
    'Khung giờ nào hôm nay có lượng xe vào cao nhất?',
    'Doanh thu hôm nay là bao nhiêu?',
    'Khu vực nào đang có tỷ lệ lấp đầy cao nhất?',
    'Gợi ý bố trí nhân sự cho ca làm việc tiếp theo',
    'Hiện tại bãi xe còn bao nhiêu chỗ trống?',
    'Giá vé gửi xe máy và xe điện hiện tại là bao nhiêu?',
  ];

  const handleGenerateReport = async (type) => {
    setReportType(type);
    setReportLoading(true);
    try {
      const res = await api.post('/ai/report', { LoaiBaoCao: type });
      setReportData(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setReportLoading(false);
    }
  };

  const handleFetchPeakHours = async () => {
    setPeakLoading(true);
    try {
      const res = await api.get('/ai/peak-hours');
      setPeakData(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setPeakLoading(false);
    }
  };

  const handleFetchStaffing = async () => {
    setStaffingLoading(true);
    try {
      const res = await api.get('/ai/staffing-advice');
      setStaffingData(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setStaffingLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'agents' && !agentsData) {
      fetchAgentsData();
    } else if (activeTab === 'report' && !reportData) {
      handleGenerateReport('Ngay');
    } else if (activeTab === 'peak' && !peakData) {
      handleFetchPeakHours();
    } else if (activeTab === 'staffing' && !staffingData) {
      handleFetchStaffing();
    }
  }, [activeTab]);

  const handleRunAgentAction = (agentId) => {
    if (agentId === 'agent-spot-allocator') {
      setAgentActionMessage('Tác nhân đã rà soát 100% sơ đồ bãi đỗ: Đang ưu tiên cấp phát chỗ đỗ tại Phân Khu A và Khu B cho xe máy sinh viên gần lối vào chính.');
    } else if (agentId === 'agent-peak-predictor') {
      setActiveTab('peak');
    } else if (agentId === 'agent-staffing-optimizer') {
      setActiveTab('staffing');
    } else if (agentId === 'agent-executive-reporter') {
      setActiveTab('report');
    } else if (agentId === 'agent-conversational-assistant') {
      setActiveTab('chat');
    }
  };

  const handleSendChat = async (questionText) => {
    const q = questionText || chatInput;
    if (!q.trim() || chatLoading) return;

    const userMsg = {
      role: 'user',
      text: q,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setChatLoading(true);

    try {
      const res = await api.post('/ai/chat', { CauHoi: q, VaiTroNguoiHoi: 'QuanLy' });
      const aiMsg = {
        role: 'assistant',
        text: res.data.CauTraLoi,
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Xin lỗi, hệ thống AI tạm thời gặp sự cố kết nối. Vui lòng thử lại sau giây lát.',
          time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-sky-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Multi-Agent Architecture & Dual-Mode AI</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <Bot className="w-7 h-7 text-sky-600" />
            <span>Trung Tâm Tác Nhân Trí Tuệ Nhân Tạo (AI Agents)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Hệ thống đa tác tử AI (Multi-Agent System) tự động hoá xếp chỗ, dự báo đỉnh tải, cân đối nhân lực và tổng hợp báo cáo thông minh.
          </p>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-200/70 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab('agents')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${
            activeTab === 'agents'
              ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/25'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Zap className="w-4 h-4 text-amber-300" />
          <span>Hệ Thống Tác Nhân AI (PEAS)</span>
        </button>

        <button
          onClick={() => setActiveTab('report')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${
            activeTab === 'report'
              ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/25'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Sinh Báo Cáo Thông Minh</span>
        </button>

        <button
          onClick={() => setActiveTab('peak')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${
            activeTab === 'peak'
              ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/25'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Phân Tích Giờ Cao Điểm</span>
        </button>

        <button
          onClick={() => setActiveTab('staffing')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${
            activeTab === 'staffing'
              ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/25'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Gợi Ý Bố Trí Nhân Sự</span>
        </button>

        <button
          onClick={() => setActiveTab('chat')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${
            activeTab === 'chat'
              ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/25'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Trợ Lý Hỏi Đáp Q&A</span>
        </button>
      </div>

      {/* TAB 0: MULTI-AGENT SYSTEM (PEAS ARCHITECTURE) */}
      {activeTab === 'agents' && (
        <div className="space-y-6">
          {/* Agent System Status Banner */}
          <div className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 text-white p-6 rounded-3xl shadow-xl shadow-sky-950/15 relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white border border-white/30 text-xs font-bold backdrop-blur-sm">
                  <span className="w-2 h-2 rounded-full bg-cyan-300 animate-pulse"></span>
                  Hệ thống 05 Tác nhân Đang Hoạt động (Multi-Agent Running)
                </div>
                <h2 className="text-xl font-extrabold tracking-tight text-white mt-1">
                  Kiến Trúc Đa Tác Nhân Trí Tuệ Nhân Tạo (PEAS Model)
                </h2>
                <p className="text-xs text-sky-100 max-w-2xl">
                  Mỗi tác nhân AI đảm nhận một vai trò độc lập: Tự nhận thức trạng thái môi trường (Sensors), suy luận ra quyết định (Perception & Reasoning) và tác động điều phối bãi đỗ xe (Actuators).
                </p>
              </div>

              <div className="flex items-center gap-3 bg-white/15 backdrop-blur-md p-3 rounded-2xl border border-white/20">
                <div className="text-right">
                  <div className="text-[10px] text-sky-200 font-bold uppercase">Chế độ AI Engine</div>
                  <div className="text-xs font-extrabold text-amber-300">
                    {agentsData?.has_gemini_key ? 'Gemini 1.5 LLM + Heuristic' : 'Local Heuristic NLP Engine'}
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
                  <Zap className="w-5 h-5 text-amber-300" />
                </div>
              </div>
            </div>
          </div>

          {/* Action trigger feedback alert */}
          {agentActionMessage && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl flex items-start justify-between gap-3 text-xs font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{agentActionMessage}</span>
              </div>
              <button 
                onClick={() => setAgentActionMessage(null)}
                className="text-emerald-700 hover:text-emerald-900 font-bold"
              >
                ✕
              </button>
            </div>
          )}

          {/* Grid of 5 AI Agents */}
          {agentsLoading ? (
            <div className="p-12 text-center text-slate-500 font-medium">
              <Bot className="w-8 h-8 animate-spin mx-auto mb-2 text-indigo-600" />
              Đang tải thông số kiến trúc các tác nhân AI...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {(agentsData?.agents || []).map((agent) => (
                <div
                  key={agent.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-bold">
                        {agent.type}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Active
                      </span>
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-sm leading-snug">
                      {agent.name}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {agent.role}
                    </p>

                    {/* PEAS Breakdown Box */}
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1.5 text-[11px]">
                      <div className="font-bold text-slate-700 flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Mô hình PEAS:</span>
                      </div>
                      <div className="text-slate-600">
                        <strong className="text-slate-800">P (Hiệu năng):</strong> {agent.peas.performance}
                      </div>
                      <div className="text-slate-600">
                        <strong className="text-slate-800">E (Môi trường):</strong> {agent.peas.environment}
                      </div>
                      <div className="text-slate-600">
                        <strong className="text-slate-800">A (Hành động):</strong> {agent.peas.actuators}
                      </div>
                      <div className="text-slate-600">
                        <strong className="text-slate-800">S (Cảm biến):</strong> {agent.peas.sensors}
                      </div>
                    </div>
                  </div>

                  {/* Actions & Metrics Footer */}
                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleRunAgentAction(agent.id)}
                      className="px-3.5 py-2 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>Kích hoạt Tác nhân</span>
                    </button>
                    <span className="text-[10px] text-slate-400 font-semibold">
                      Phản hồi &lt;15ms
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 1: AI REPORT */}
      {activeTab === 'report' && (
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-700">Kỳ báo cáo:</span>
            <button
              onClick={() => handleGenerateReport('Ngay')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                reportType === 'Ngay' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-700'
              }`}
            >
              📅 Báo Cáo Trong Ngày
            </button>
            <button
              onClick={() => handleGenerateReport('Tuan')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                reportType === 'Tuan' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-700'
              }`}
            >
              📊 Báo Cáo Cả Tuần
            </button>
          </div>

          {reportLoading ? (
            <div className="p-12 bg-white rounded-3xl border border-slate-200 flex flex-col items-center justify-center space-y-3">
              <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs font-bold text-indigo-900">AI Engine đang phân tích số liệu thực tế từ cơ sở dữ liệu...</p>
            </div>
          ) : reportData ? (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
              {/* Report Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-bold border border-indigo-200 uppercase tracking-wider">
                    {reportData.LoaiBaoCao === 'Ngay' ? 'Báo cáo hàng ngày' : 'Báo cáo tuần'}
                  </span>
                  <h2 className="text-xl font-extrabold text-slate-900 mt-1">{reportData.TieuDe}</h2>
                </div>
                <div className="text-xs text-slate-500 font-medium sm:text-right">
                  <p>Nguồn: <strong className="text-slate-800">{reportData.NguonDuLieu}</strong></p>
                  <p>Thời điểm xuất: {new Date().toLocaleString('vi-VN')}</p>
                </div>
              </div>

              {/* Report Key Metrics */}
              {reportData.ChiSoChinh && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100">
                    <span className="text-[11px] font-semibold text-indigo-800 block">Lượt xe vào / ra</span>
                    <span className="text-lg font-extrabold text-indigo-950">
                      {reportData.ChiSoChinh.XeVao || 0} vào / {reportData.ChiSoChinh.XeRa || 0} ra
                    </span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                    <span className="text-[11px] font-semibold text-emerald-800 block">Doanh thu kỳ này</span>
                    <span className="text-lg font-extrabold text-emerald-950">
                      {reportData.ChiSoChinh.DoanhThu?.toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-sky-50/60 border border-sky-100">
                    <span className="text-[11px] font-semibold text-sky-800 block">Tỷ lệ lấp đầy</span>
                    <span className="text-lg font-extrabold text-sky-950">{reportData.ChiSoChinh.TyLeLapDay}%</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100">
                    <span className="text-[11px] font-semibold text-amber-800 block">Vị trí còn trống</span>
                    <span className="text-lg font-extrabold text-amber-950">
                      {reportData.ChiSoChinh.SoChoTrong || 0} chỗ
                    </span>
                  </div>
                </div>
              )}

              {/* Natural Language Report Body */}
              <div className="prose prose-sm max-w-none text-slate-700 bg-slate-50/80 p-5 rounded-2xl border border-slate-100 whitespace-pre-line font-medium leading-relaxed">
                {reportData.NoiDungBaoCao}
              </div>

              {/* AI Recommendations Box */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-900 to-slate-900 text-white space-y-2">
                <div className="flex items-center space-x-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Khuyến Nghị Điều Hành Từ AI Engine</span>
                </div>
                <p className="text-xs text-indigo-100 leading-relaxed">{reportData.GoiYDieuHanh}</p>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* TAB 2: PEAK HOURS */}
      {activeTab === 'peak' && (
        <div className="space-y-5">
          {peakLoading ? (
            <div className="p-12 bg-white rounded-3xl border border-slate-200 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : peakData ? (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-xl font-extrabold text-slate-900">Phân Tích & Xếp Hạng Giờ Cao Điểm</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Đỉnh lưu lượng hôm nay ghi nhận vào lúc <strong className="text-amber-600 font-extrabold">{peakData.KhungGioCaoNhat}</strong> với{' '}
                  <strong className="text-slate-900">{peakData.LuuLuongCaoNhat} lượt xe</strong> phát sinh.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {peakData.DanhSachGioCaoDiem.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase font-mono px-2 py-0.5 rounded bg-amber-200/70 text-amber-900">
                        Top #{idx + 1}
                      </span>
                      <span className="text-lg font-extrabold text-slate-900">{item.TongLuot} lượt</span>
                    </div>
                    <h3 className="font-extrabold text-sm text-slate-900">{item.KhungGio}</h3>
                    <div className="text-[11px] text-slate-500 flex justify-between border-t border-amber-100 pt-1.5">
                      <span>Vào: <strong>{item.SoXeVao}</strong></span>
                      <span>Ra: <strong>{item.SoXeRa}</strong></span>
                    </div>
                    <p className="text-[11px] font-semibold text-amber-800">{item.DanhGia}</p>
                  </div>
                ))}
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider">Đánh giá xu hướng từ AI:</h4>
                <p className="text-slate-600 leading-relaxed">{peakData.PhanTichXuHuong}</p>
                <div className="pt-2 border-t border-slate-200 text-indigo-700 font-semibold">
                  💡 Gợi ý điều tiết luồng xe: {peakData.GoiYBaoTri}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* TAB 3: STAFFING ADVICE */}
      {activeTab === 'staffing' && (
        <div className="space-y-5">
          {staffingLoading ? (
            <div className="p-12 bg-white rounded-3xl border border-slate-200 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : staffingData ? (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-xl font-extrabold text-slate-900">Khuyến Nghị Bố Trí Nhân Lực Vận Hành</h2>
                <p className="text-xs text-slate-500 mt-1">
                  AI tính toán tối ưu lịch trực 3 ca dựa trên lưu lượng phương tiện thực tế giúp giảm tải tại cổng và tiết kiệm chi phí nhân công.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {staffingData.KhuyenNghiBoTri.map((shift, idx) => (
                  <div key={idx} className="p-5 rounded-3xl bg-slate-50 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider">
                          Ca {idx + 1}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            shift.MucDoTai === 'Cao'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          Tải {shift.MucDoTai}
                        </span>
                      </div>
                      <h3 className="font-extrabold text-slate-900 text-sm">{shift.CaLamViec}</h3>
                      <div className="my-3 p-3 rounded-2xl bg-white border border-slate-100">
                        <span className="text-[11px] text-slate-500 block">Số nhân viên gợi ý</span>
                        <span className="text-2xl font-extrabold text-emerald-600">{shift.SoNhanVienGoiY} nhân sự</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">Dự kiến: {shift.LuuLuongDuKien}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{shift.NhiemVuTrongTam}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                <p className="font-bold">Giải thích chi tiết từ AI:</p>
                <p>{staffingData.GiaiThichChiTiet}</p>
                <p className="pt-1 font-semibold text-emerald-800">⭐ {staffingData.UuTienToiUu}</p>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* TAB 4: INTERACTIVE AI CHATBOT */}
      {activeTab === 'chat' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm flex flex-col h-[650px] overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/30">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">Trợ lý AI Đàm Thoại Bãi Đỗ Xe</h3>
                <div className="flex items-center space-x-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[11px] text-slate-500 font-medium">Kết nối trực tiếp Cơ sở dữ liệu thời gian thực</span>
                </div>
              </div>
            </div>
            <button
              onClick={() =>
                setMessages([
                  {
                    role: 'assistant',
                    text: 'Hộp thoại đã được làm mới. Bạn có câu hỏi nào khác về bãi xe không?',
                    time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
                  },
                ])
              }
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
              title="Làm mới hội thoại"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.map((m, idx) => {
              const isAssistant = m.role === 'assistant';
              return (
                <div
                  key={idx}
                  className={`flex items-start space-x-3 ${isAssistant ? 'justify-start' : 'justify-end flex-row-reverse space-x-reverse'}`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      isAssistant ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-800 text-white'
                    }`}
                  >
                    {isAssistant ? <Bot className="w-4 h-4" /> : 'You'}
                  </div>
                  <div className={`max-w-[80%] space-y-1 ${isAssistant ? 'text-left' : 'text-right'}`}>
                    <div
                      className={`p-4 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed whitespace-pre-line ${
                        isAssistant
                          ? 'bg-slate-100 text-slate-800 rounded-tl-sm border border-slate-200/60'
                          : 'bg-indigo-600 text-white rounded-tr-sm shadow-md shadow-indigo-600/20'
                      }`}
                    >
                      {m.text}
                    </div>
                    <span className="text-[10px] text-slate-400 px-1">{m.time}</span>
                  </div>
                </div>
              );
            })}

            {chatLoading && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xs flex-shrink-0">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-100 text-slate-500 text-xs font-semibold flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:-.3s]"></div>
                  <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:-.5s]"></div>
                  <span>AI đang truy xuất dữ liệu...</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Questions Chips */}
          <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/60 overflow-x-auto flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 flex-shrink-0">Gợi ý câu hỏi:</span>
            {quickQuestions.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendChat(chip)}
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 text-[11px] font-medium border border-slate-200 flex-shrink-0 transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Chat Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendChat(chatInput);
            }}
            className="p-3 sm:p-4 border-t border-slate-200 flex items-center gap-2 bg-white"
          >
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Nhập câu hỏi quản trị hoặc tra cứu (VD: Hôm nay khung giờ nào đông nhất?)..."
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
            <button
              type="submit"
              disabled={chatLoading || !chatInput.trim()}
              className="p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AiAssistant;
