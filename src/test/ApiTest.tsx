import React, { useState } from "react";
import { apiClient } from "../api/apiClient";

interface TestResult {
  service: string;
  status: "success" | "error" | "loading";
  message: string;
  data?: unknown;
}

const ApiTest: React.FC = () => {
  const [results, setResults] = useState<TestResult[]>([
    { service: "Go Servisi (8082)", status: "loading", message: "Test ediliyor..." },
    { service: "FastAPI (9003)", status: "loading", message: "Test ediliyor..." },
    { service: "FastAPI /me/test", status: "loading", message: "Test ediliyor..." },
  ]);
  const [loading, setLoading] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);

  const addLog = (log: string) => {
    console.log(log);
    setConsoleLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${log}`]);
  };

  const runSimpleTest = async () => {
    setLoading(true);
    setConsoleLogs([]);
    addLog("🚀 Test başlatılıyor...");
    
    setResults([
      { service: "Go Servisi (8082)", status: "loading", message: "Test ediliyor..." },
      { service: "FastAPI (9003)", status: "loading", message: "Test ediliyor..." },
      { service: "FastAPI /me/test", status: "loading", message: "Test ediliyor..." },
    ]);

    try {
      // Sırayla test et
      addLog("1. Go servisi test ediliyor...");
      await testGo();
      
      addLog("2. FastAPI root test ediliyor...");
      await testFastApiRoot();
      
      addLog("3. FastAPI /me/test test ediliyor...");
      await testFastApiMeTest();
      
      addLog("✅ Tüm testler tamamlandı!");
    } catch (error) {
      addLog(`❌ Test sırasında hata: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testGo = async (): Promise<void> => {
    try {
      addLog("📡 Go /ping endpoint'ine istek gönderiliyor...");
      const response = await apiClient.goGet<unknown>("/ping");
      
      addLog(`📥 Go yanıtı: ${JSON.stringify(response, null, 2)}`);
      
      // ✅ SAFE CHECK
      const data = response as { message?: string; service?: string; [key: string]: unknown };
      const message = data?.message || data?.service || "Go servisi çalışıyor";
      
      setResults(prev => prev.map(r => 
        r.service === "Go Servisi (8082)" 
          ? { 
              service: "Go Servisi (8082)", 
              status: "success", 
              message: `✅ ${message}`,
              data: response 
            }
          : r
      ));
      addLog(`✅ Go servisi: ${message}`);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Bilinmeyen hata";
      addLog(`❌ Go hatası: ${message}`);
      
      setResults(prev => prev.map(r => 
        r.service === "Go Servisi (8082)" 
          ? { 
              service: "Go Servisi (8082)", 
              status: "error", 
              message: `❌ ${message}`,
            }
          : r
      ));
    }
  };

  const testFastApiRoot = async (): Promise<void> => {
    try {
      addLog("📡 FastAPI / endpoint'ine istek gönderiliyor...");
      const response = await apiClient.get<unknown>("/", { skipAuth: true });
      
      addLog(`📥 FastAPI root yanıtı: ${JSON.stringify(response, null, 2)}`);
      
      // ✅ SAFE CHECK
      const data = response as { message?: string; [key: string]: unknown };
      const message = data?.message || "FastAPI çalışıyor";
      
      setResults(prev => prev.map(r => 
        r.service === "FastAPI (9003)" 
          ? { 
              service: "FastAPI (9003)", 
              status: "success", 
              message: `✅ ${message}`,
              data: response 
            }
          : r
      ));
      addLog(`✅ FastAPI root: ${message}`);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Bilinmeyen hata";
      addLog(`❌ FastAPI root hatası: ${message}`);
      
      setResults(prev => prev.map(r => 
        r.service === "FastAPI (9003)" 
          ? { 
              service: "FastAPI (9003)", 
              status: "error", 
              message: `❌ ${message}`,
            }
          : r
      ));
    }
  };

  const testFastApiMeTest = async (): Promise<void> => {
    try {
      addLog("📡 FastAPI /me/test endpoint'ine istek gönderiliyor...");
      const response = await apiClient.get<unknown>("/me/test", { skipAuth: true });
      
      addLog(`📥 FastAPI /me/test yanıtı: ${JSON.stringify(response, null, 2)}`);
      
      // ✅ SAFE CHECK
      const data = response as { id?: string; email?: string; role?: string; [key: string]: unknown };
      const message = data?.id 
        ? `✅ Kullanıcı: ${data.email || "test@craftora.com"}`
        : `✅ Test endpoint çalışıyor`;
      
      setResults(prev => prev.map(r => 
        r.service === "FastAPI /me/test" 
          ? { 
              service: "FastAPI /me/test", 
              status: "success", 
              message,
              data: response 
            }
          : r
      ));
      addLog(`✅ FastAPI /me/test: ${message}`);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Bilinmeyen hata";
      addLog(`❌ FastAPI /me/test hatası: ${message}`);
      
      setResults(prev => prev.map(r => 
        r.service === "FastAPI /me/test" 
          ? { 
              service: "FastAPI /me/test", 
              status: "error", 
              message: `❌ ${message}`,
            }
          : r
      ));
    }
  };

  const StatusIcon: React.FC<{ status: TestResult["status"] }> = ({ status }) => {
    switch (status) {
      case "success": return <span style={{ color: "#2ecc71", fontSize: "20px" }}>✅</span>;
      case "error": return <span style={{ color: "#e74c3c", fontSize: "20px" }}>❌</span>;
      case "loading": return <span style={{ color: "#3498db", fontSize: "20px" }}>⏳</span>;
      default: return <span>❓</span>;
    }
  };

  return (
    <div style={{ 
      padding: "24px", 
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      maxWidth: "800px", 
      margin: "0 auto",
    }}>
      <h2 style={{ color: "#2c3e50", marginBottom: "24px", textAlign: "center" }}>
        🧪 Basit API Test (Console Log ile)
      </h2>
      
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <button
          onClick={runSimpleTest}
          disabled={loading}
          style={{
            padding: "12px 24px",
            backgroundColor: loading ? "#95a5a6" : "#3498db",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          {loading ? "⏳ Test Ediliyor..." : "🚀 Testi Başlat"}
        </button>
        
        <button
          onClick={() => setConsoleLogs([])}
          style={{
            padding: "12px 24px",
            backgroundColor: "#7f8c8d",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "16px",
            marginLeft: "12px"
          }}
        >
          🗑️ Log'ları Temizle
        </button>
      </div>
      
      {/* TEST SONUÇLARI */}
      <div style={{ 
        backgroundColor: "white", 
        padding: "20px", 
        borderRadius: "12px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        marginBottom: "20px"
      }}>
        <h3 style={{ color: "#34495e", marginBottom: "16px" }}>Test Sonuçları:</h3>
        {results.map((result, index) => (
          <div 
            key={index}
            style={{ 
              padding: "16px",
              marginBottom: "12px",
              borderRadius: "8px",
              backgroundColor: 
                result.status === "success" ? "#d4edda" :
                result.status === "error" ? "#f8d7da" : "#d6eaf8",
              borderLeft: `4px solid ${
                result.status === "success" ? "#2ecc71" :
                result.status === "error" ? "#e74c3c" : "#3498db"
              }`
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <StatusIcon status={result.status} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: "bold", color: "#2c3e50" }}>
                  {result.service}
                </div>
                <div style={{ 
                  color: result.status === "error" ? "#c0392b" : "#2c3e50",
                  fontSize: "14px",
                  marginTop: "4px"
                }}>
                  {result.message}
                </div>
                {result.data && (
                  <div style={{ 
                    fontSize: "12px", 
                    color: "#7f8c8d",
                    marginTop: "8px",
                    padding: "8px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "4px",
                    fontFamily: "monospace",
                    maxHeight: "100px",
                    overflow: "auto"
                  }}>
                    <strong>Data:</strong> {JSON.stringify(result.data, null, 2)}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* CONSOLE LOGS */}
      <div style={{ 
        backgroundColor: "#2c3e50", 
        padding: "20px", 
        borderRadius: "12px",
        marginBottom: "20px",
        color: "white"
      }}>
        <h3 style={{ marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
          <span>📋 Console Logs</span>
          <span style={{ fontSize: "12px", backgroundColor: "#34495e", padding: "2px 8px", borderRadius: "12px" }}>
            {consoleLogs.length} log
          </span>
        </h3>
        
        <div style={{ 
          backgroundColor: "#1a252f", 
          padding: "16px", 
          borderRadius: "8px",
          maxHeight: "300px",
          overflowY: "auto",
          fontFamily: "monospace",
          fontSize: "13px"
        }}>
          {consoleLogs.length === 0 ? (
            <div style={{ color: "#95a5a6", textAlign: "center", padding: "20px" }}>
              Henüz log yok. Testi başlatın!
            </div>
          ) : (
            consoleLogs.map((log, index) => (
              <div 
                key={index}
                style={{ 
                  padding: "8px 0",
                  borderBottom: index < consoleLogs.length - 1 ? "1px solid #34495e" : "none",
                  color: log.includes("✅") ? "#2ecc71" : 
                         log.includes("❌") ? "#e74c3c" : 
                         log.includes("📡") ? "#3498db" :
                         log.includes("📥") ? "#9b59b6" : "#ecf0f1"
                }}
              >
                {log}
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* API BİLGİLERİ */}
      <div style={{ 
        marginTop: "20px", 
        padding: "16px", 
        backgroundColor: "#ecf0f1",
        borderRadius: "8px",
        fontSize: "14px"
      }}>
        <strong>ℹ️ API Bilgileri:</strong>
        <ul style={{ margin: "8px 0", paddingLeft: "20px" }}>
          <li>Go Servisi: <code>http://localhost:8082</code></li>
          <li>FastAPI: <code>http://localhost:9003</code></li>
          <li>React: <code>http://localhost:5173</code></li>
          <li>Browser Console'a da bakın! (F12)</li>
        </ul>
      </div>
    </div>
  );
};

export default ApiTest;