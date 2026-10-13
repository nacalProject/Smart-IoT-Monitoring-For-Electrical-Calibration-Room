import React, { useState } from 'react';
import { X, Cpu, Copy, Check, Terminal, Wifi } from 'lucide-react';

interface ESP32ModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiEndpoint?: string;
}

export const ESP32Modal: React.FC<ESP32ModalProps> = ({
  isOpen,
  onClose,
  apiEndpoint = 'https://your-backend-api.com/api/telemetry'
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const arduinoCode = `#include <WiFi.h>
#include <HTTPClient.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* serverName = "${apiEndpoint}";

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  while(WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\\nWiFi Connected!");
}

void loop() {
  if(WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverName);
    http.addHeader("Content-Type", "application/json");
    
    // อ่านค่าจากเซนเซอร์จริง
    float temp = 25.0; // แทนด้วยคำสั่งอ่านค่าจริง เช่น dht.readTemperature()
    float hum = 60.0;  // แทนด้วยคำสั่งอ่านค่าจริง เช่น dht.readHumidity()
    
    String jsonPayload = "{\\"temperature\\":" + String(temp) + ",\\"humidity\\":" + String(hum) + "}";
    int httpResponseCode = http.POST(jsonPayload);
    
    Serial.print("HTTP Response Code: ");
    Serial.println(httpResponseCode);
    http.end();
  }
  delay(10000); // ส่งข้อมูลทุกๆ 10 วินาที
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(arduinoCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h3 className="font-semibold text-white">ESP32 Setup & Guide</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto text-slate-300">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white font-medium">
              <Wifi className="w-4 h-4 text-cyan-400" />
              <span>วิธีเชื่อมต่ออุปกรณ์ ESP32 จริงเข้ากับระบบ</span>
            </div>
            <p className="text-sm text-slate-400">
              นำตัวอย่างโค้ดด้านล่างไปอัปโหลดลงบอร์ด ESP32 เพื่อส่งค่าจากเซนเซอร์จริงเข้าสู่ระบบตามช่วงเวลาที่กำหนด
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                <Terminal className="w-3.5 h-3.5" /> Arduino C++ Sample Code
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'คัดลอกแล้ว' : 'คัดลอกโค้ด'}
              </button>
            </div>
            <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto max-h-64">
              {arduinoCode}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ESP32Modal;