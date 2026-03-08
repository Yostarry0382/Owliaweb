import { useState, useRef, useEffect } from "react";

const SYSTEM_PROMPT = `あなたは「Owlia（オウリア）」という社内生成AIプラットフォームの案内フクロウ「オウくん」です。
ユーザーがAIで実現したいことを聞いて、Owliaの適切なアプリを紹介してください。

## Owliaとは
NIT社内専用の生成AIスイートです。社内ドキュメントを学習（RAG）し、Copilot等では返せない"NIT特有の答え"を提供します。

## アプリ一覧
- **Owlia-Sprite**（利用可能）: デスクトップ常駐ランチャー。Ctrl+Oで即起動。音声入力・テキスト選択・タスク登録・簡易チャット対応。exeをDLするだけ。
- **Owlia-Portal**（利用可能）: メインチャット基地。社内ドキュメントのRAG設定・チャット跨ぎの記憶・ファイルサーバー一括学習。ID=氏名コード、初回PW=12345678。
- **Owlia-COBOL**（Coming Soon）: VSCode風画面でCOBOL開発。日本語指示でコーディング・AI校正。
- **Owlia-Grimoire**（利用可能）: 開発者向けAPIプラットフォーム。Owlia APIをアプリ開発に組み込み可能。
- **Owlia-Chronicle**（Coming Soon）: AIタスク管理・議事録自動要約・スケジュール管理。
- **Owlia-Plugins**（Coming Soon）: VSCode等の開発環境にAIを統合。

## 回答スタイル
- 親しみやすいです・ます体で話す
- 「ホホウ！」「なるほど〜」などフクロウらしい相槌を自然に使う
- ユーザーのやりたいことに対して最適なOwliaアプリを1〜2個紹介する
- Coming Soonアプリはその旨を伝える
- 回答は短め（3〜5文）でテンポよく
- 最後に「他に気になることはありますか？」と聞く
- Owliaで対応できないことには「現時点ではOwliaの対応範囲外ですが、貴重なご意見として記録しておきます！」と答える
- マークダウンの**太字**は使ってOK、箇条書きも適度に使う`;

const QUICK_CHIPS = [
  "社内資料をAIに覚えさせたい",
  "どこからでもAIをすぐ使いたい",
  "COBOL開発を楽にしたい",
  "議事録を自動でまとめたい",
  "Copilotと何が違うの？",
  "アプリにAIを組み込みたい",
];

const ADMIN_PASS = "owlia-admin";
const uid = () => Math.random().toString(36).slice(2, 9);
const nowLabel = () => new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });

function MdText({ text }) {
  const lines = text.split("\n");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {lines.map((line, i) => {
        if (line.startsWith("- ") || line.startsWith("• ")) {
          const content = line.slice(2);
          return (
            <div key={i} style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
              <span style={{ color: "#2a8fa5", fontWeight: 700, marginTop: 1 }}>•</span>
              <span dangerouslySetInnerHTML={{ __html: boldify(content) }} />
            </div>
          );
        }
        return line ? (
          <p key={i} dangerouslySetInnerHTML={{ __html: boldify(line) }} style={{ margin: 0, lineHeight: 1.7 }} />
        ) : <div key={i} style={{ height: 4 }} />;
      })}
    </div>
  );
}
function boldify(s) {
  return s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

export default function OwliaChatbot() {
  const [tab, setTab] = useState("chat");
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [adminPwInput, setAdminPwInput] = useState("");
  const [adminErr, setAdminErr] = useState("");

  const [messages, setMessages] = useState([{
    role: "assistant", id: uid(),
    content: "ホホウ！こんにちは🦉 わたしはOwliaのご案内フクロウです。\n\n**「AIを使って何を実現させたい？」**\n\n業務で困っていること・やりたいことを自由に入力してください。あなたに合ったOwliaアプリをご紹介します！",
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState([]);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);
  useEffect(() => { loadRequests(); }, []);

  async function loadRequests() {
    try {
      const res = await window.storage.list("owlia_req:");
      const items = await Promise.all(res.keys.map(async (k) => {
        try { const r = await window.storage.get(k); return r ? JSON.parse(r.value) : null; }
        catch { return null; }
      }));
      setRequests(items.filter(Boolean).sort((a, b) => b.ts - a.ts));
    } catch { setRequests([]); }
  }

  async function saveRequest(msg) {
    const id = uid();
    const rec = { id, message: msg, ts: Date.now(), label: nowLabel() };
    try {
      await window.storage.set(`owlia_req:${id}`, JSON.stringify(rec));
      setRequests(p => [rec, ...p]);
    } catch {}
  }

  async function deleteRequest(id) {
    try { await window.storage.delete(`owlia_req:${id}`); setRequests(p => p.filter(r => r.id !== id)); } catch {}
  }

  async function send(text) {
    const txt = (text ?? input).trim();
    if (!txt || loading) return;
    setInput("");
    const userMsg = { role: "user", id: uid(), content: txt };
    const next = [...messages, userMsg];
    setMessages(next);
    setLoading(true);
    await saveRequest(txt);
    try {
      const history = next.map(m => ({ role: m.role, content: m.content }));
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system: SYSTEM_PROMPT, messages: history }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text ?? "申し訳ありません、回答できませんでした。";
      setMessages(p => [...p, { role: "assistant", id: uid(), content: reply }]);
    } catch {
      setMessages(p => [...p, { role: "assistant", id: uid(), content: "ごめんなさい🦉 エラーが発生しました。少し待ってから再度お試しください。" }]);
    } finally { setLoading(false); }
  }

  function handleAdminLogin() {
    if (adminPwInput === ADMIN_PASS) { setAdminUnlocked(true); setAdminErr(""); loadRequests(); }
    else setAdminErr("パスワードが違います");
  }

  const T = "#1a6b7c", TL = "#2a8fa5", TP = "#e8f4f7", TM = "#b8dde6",
    DK = "#1a2d32", GR = "#5a6e74", GL = "#f4f8f9", GB = "#dde8ec", WH = "#ffffff";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap');
        @keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }
        @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:.4} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .ow-chip:hover { background:#e8f4f7 !important; border-color:#1a6b7c !important; color:#0f4a58 !important; }
        .ow-del:hover  { color:#e55 !important; }
        .ow-send:hover:not([disabled]) { transform:scale(1.08) !important; }
        .ow-tab:hover  { color:#1a6b7c !important; }
        ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-track{background:transparent} ::-webkit-scrollbar-thumb{background:#b8dde6;border-radius:4px}
      `}</style>

      {/* ── OUTER WRAPPER centred on screen ── */}
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#f0f8fa,#e8f4f7)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "'Noto Sans JP',sans-serif" }}>

        <div style={{ width: "100%", maxWidth: 480, borderRadius: 22, overflow: "hidden", boxShadow: "0 12px 56px rgba(26,107,124,0.18)", border: `1.5px solid ${TM}`, display: "flex", flexDirection: "column", height: 660, background: WH }}>

          {/* ── HEADER ── */}
          <div style={{ background: `linear-gradient(135deg,${T},${TL})`, padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 42, height: 42, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>🦉</div>
              <div>
                <div style={{ color: WH, fontWeight: 700, fontSize: 14 }}>Owlia AIガイド</div>
                <div style={{ color: "rgba(255,255,255,0.78)", fontSize: 11, marginTop: 2, display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80", display: "inline-block", animation: "pulse 2s infinite" }} />
                  オウくんがご案内します
                </div>
              </div>
            </div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 18 }}>🦉</div>
          </div>

          {/* ── TAB BAR ── */}
          <div style={{ display: "flex", background: GL, borderBottom: `1px solid ${GB}`, flexShrink: 0 }}>
            {[["chat", "💬 AIに相談する"], ["admin", "🔑 管理者ページ"]].map(([key, label]) => (
              <button key={key} className="ow-tab"
                onClick={() => setTab(key)}
                style={{ flex: 1, padding: "10px 0", border: "none", background: "none", cursor: "pointer", fontSize: 12, fontWeight: tab === key ? 700 : 500, color: tab === key ? T : GR, borderBottom: tab === key ? `2.5px solid ${T}` : "2.5px solid transparent", transition: "all .2s", fontFamily: "inherit" }}>
                {label}
              </button>
            ))}
          </div>

          {/* ══════════════════════════════ */}
          {/* CHAT TAB                       */}
          {/* ══════════════════════════════ */}
          {tab === "chat" && <>
            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "16px 14px", display: "flex", flexDirection: "column", gap: 12 }}>
              {messages.map(m => m.role === "assistant" ? (
                <div key={m.id} style={{ display: "flex", gap: 8, alignItems: "flex-end", animation: "fadeUp .3s ease" }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: TP, border: `1px solid ${TM}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 }}>🦉</div>
                  <div style={{ maxWidth: "82%", background: GL, border: `1px solid ${GB}`, borderRadius: "4px 16px 16px 16px", padding: "10px 14px", fontSize: 13, color: DK, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                    <MdText text={m.content} />
                  </div>
                </div>
              ) : (
                <div key={m.id} style={{ alignSelf: "flex-end", animation: "fadeUp .3s ease" }}>
                  <div style={{ maxWidth: "82%", background: `linear-gradient(135deg,${T},${TL})`, borderRadius: "16px 16px 4px 16px", padding: "10px 14px", fontSize: 13, color: WH, boxShadow: "0 2px 12px rgba(26,107,124,0.22)", lineHeight: 1.7 }}>
                    {m.content}
                  </div>
                </div>
              ))}

              {/* Typing */}
              {loading && (
                <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: TP, border: `1px solid ${TM}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>🦉</div>
                  <div style={{ background: GL, border: `1px solid ${GB}`, borderRadius: "4px 16px 16px 16px", padding: "12px 16px", display: "flex", gap: 5, alignItems: "center" }}>
                    {[0, 0.2, 0.4].map((d, i) => (
                      <span key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: TL, display: "inline-block", animation: `bounce 1.2s ${d}s infinite` }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick chips */}
            <div style={{ padding: "8px 12px", display: "flex", flexWrap: "wrap", gap: 6, borderTop: `1px solid ${GB}`, background: GL, flexShrink: 0 }}>
              {QUICK_CHIPS.map(c => (
                <button key={c} className="ow-chip" disabled={loading}
                  onClick={() => send(c)}
                  style={{ background: WH, border: `1.5px solid ${TM}`, borderRadius: 100, padding: "5px 12px", fontSize: 11, fontWeight: 600, color: T, cursor: "pointer", transition: "all .15s", fontFamily: "inherit" }}>
                  {c}
                </button>
              ))}
            </div>

            {/* Input */}
            <div style={{ display: "flex", gap: 8, padding: "10px 12px", background: WH, borderTop: `1px solid ${GB}`, flexShrink: 0 }}>
              <textarea rows={1}
                style={{ flex: 1, border: `1.5px solid ${TM}`, borderRadius: 12, padding: "9px 12px", fontSize: 13, fontFamily: "inherit", color: DK, outline: "none", background: GL, resize: "none", lineHeight: 1.5 }}
                placeholder="AIで実現したいことを入力…"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              />
              <button className="ow-send" disabled={!input.trim() || loading}
                onClick={() => send()}
                style={{ width: 40, height: 40, borderRadius: "50%", background: (!input.trim() || loading) ? GB : `linear-gradient(135deg,${T},${TL})`, border: "none", cursor: (!input.trim() || loading) ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, alignSelf: "flex-end", transition: "all .2s", boxShadow: (!input.trim() || loading) ? "none" : "0 2px 10px rgba(26,107,124,0.3)" }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                  <path d="M22 2L11 13" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
                  <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </>}

          {/* ══════════════════════════════ */}
          {/* ADMIN TAB                      */}
          {/* ══════════════════════════════ */}
          {tab === "admin" && (
            !adminUnlocked ? (
              /* Login */
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, padding: 28, textAlign: "center" }}>
                <div style={{ fontSize: 52 }}>🔐</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: DK }}>管理者ログイン</div>
                <div style={{ fontSize: 12, color: GR, lineHeight: 1.7 }}>ユーザーが入力した要望の一覧を<br />確認・管理できます</div>
                <input type="password" placeholder="パスワードを入力"
                  value={adminPwInput}
                  onChange={e => setAdminPwInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleAdminLogin()}
                  style={{ border: `1.5px solid ${TM}`, borderRadius: 10, padding: "9px 14px", fontSize: 13, fontFamily: "inherit", color: DK, outline: "none", background: GL, width: "100%", maxWidth: 240, textAlign: "center" }}
                />
                {adminErr && <div style={{ color: "#e55", fontSize: 12 }}>{adminErr}</div>}
                <button onClick={handleAdminLogin}
                  style={{ background: `linear-gradient(135deg,${T},${TL})`, color: WH, border: "none", borderRadius: 10, padding: "10px 28px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                  ログイン
                </button>
              </div>
            ) : (
              /* Request list */
              <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: DK }}>
                    📋 ユーザー要望一覧
                    <span style={{ marginLeft: 8, background: T, color: WH, borderRadius: 100, padding: "1px 10px", fontSize: 11, fontWeight: 700 }}>{requests.length}件</span>
                  </div>
                  <button onClick={() => { setAdminUnlocked(false); setAdminPwInput(""); }}
                    style={{ background: "none", border: "none", cursor: "pointer", color: GR, fontSize: 11, fontFamily: "inherit" }}>
                    ログアウト
                  </button>
                </div>

                {requests.length === 0 ? (
                  <div style={{ textAlign: "center", color: GR, fontSize: 13, padding: 32 }}>
                    <div style={{ fontSize: 36, marginBottom: 8 }}>🦉</div>
                    まだ要望はありません
                  </div>
                ) : requests.map(r => (
                  <div key={r.id} style={{ background: GL, border: `1px solid ${GB}`, borderRadius: 12, padding: "12px 36px 12px 14px", position: "relative", animation: "fadeUp .25s ease" }}>
                    <div style={{ fontSize: 13, color: DK, fontWeight: 500, lineHeight: 1.6 }}>「{r.message}」</div>
                    <div style={{ fontSize: 11, color: GR, marginTop: 4 }}>🕐 {r.label}</div>
                    <button className="ow-del"
                      onClick={() => deleteRequest(r.id)}
                      style={{ position: "absolute", top: 10, right: 10, background: "none", border: "none", cursor: "pointer", color: "#ccc", fontSize: 13, fontFamily: "inherit", lineHeight: 1, transition: "color .15s" }}
                      title="削除">✕</button>
                  </div>
                ))}
              </div>
            )
          )}

        </div>
      </div>
    </>
  );
}
