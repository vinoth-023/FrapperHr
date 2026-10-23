'use client';

import React, { useState } from 'react';
import { Database, AlertTriangle, CheckCircle, RefreshCw, X, ShieldAlert } from 'lucide-react';
import { testFirestoreConnection, type DiagnosticResult } from '../lib/firebase/client';

export const ConnectionDiagnostics: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<DiagnosticResult | null>(null);

  const runDiagnostics = async () => {
    setRunning(true);
    try {
      const res = await testFirestoreConnection();
      setResult(res);
    } finally {
      setRunning(false);
    }
  };

  const openAndRun = () => {
    setIsOpen(true);
    if (!result) {
      runDiagnostics();
    }
  };

  return (
    <>
      <button
        onClick={openAndRun}
        className="inline-flex items-center gap-1.5 px-2 py-1 text-[11px] font-medium rounded-md border border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 transition"
        title="Check Named Database & Storage Configuration"
      >
        <Database className="w-3.5 h-3.5 text-indigo-400" />
        <span>DB Diagnostics</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-xl border border-zinc-800 bg-zinc-900 p-5 shadow-2xl text-zinc-100">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-semibold text-white">Firestore & Storage Diagnostics</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-zinc-400 hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 text-zinc-300 bg-zinc-950 p-3 rounded-lg border border-zinc-800/80">
                <div>
                  <span className="text-zinc-500 block text-[10px] uppercase">Named Database</span>
                  <span className="font-mono text-indigo-400 font-semibold">maxco-hr</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px] uppercase">GCP Project ID</span>
                  <span className="font-mono text-zinc-200 font-semibold">maxco-certificate-generator</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px] uppercase">Storage Bucket</span>
                  <span className="font-mono text-zinc-200 truncate block">maxco-certificate-generator.firebasestorage.app</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px] uppercase">Storage HRMS Prefix</span>
                  <span className="font-mono text-indigo-400 font-semibold">maxco-hr/</span>
                </div>
              </div>

              {running ? (
                <div className="p-4 rounded-lg bg-zinc-950/80 border border-zinc-800 flex items-center justify-center gap-2 text-zinc-400">
                  <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
                  <span>Probing Firestore route...</span>
                </div>
              ) : result ? (
                <div
                  className={`p-3.5 rounded-lg border text-xs space-y-1.5 ${
                    result.status === 'SUCCESS' || result.status === 'NOT_FOUND'
                      ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-300'
                      : result.status === 'PERMISSION_DENIED'
                      ? 'bg-amber-950/30 border-amber-800/50 text-amber-300'
                      : 'bg-rose-950/30 border-rose-800/50 text-rose-300'
                  }`}
                >
                  <div className="flex items-center gap-2 font-semibold">
                    {result.status === 'SUCCESS' || result.status === 'NOT_FOUND' ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    ) : result.status === 'PERMISSION_DENIED' ? (
                      <ShieldAlert className="w-4 h-4 text-amber-400" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                    )}
                    <span>Diagnostic Status: {result.status}</span>
                  </div>
                  <p className="text-[11px] leading-relaxed opacity-90">{result.message}</p>
                  {result.missingVariables && result.missingVariables.length > 0 && (
                    <div className="mt-2 text-[10px] bg-zinc-900/80 p-2 rounded-sm border border-zinc-800 text-zinc-300">
                      <span className="font-semibold block text-amber-400 mb-1">Required Client Keys:</span>
                      <ul className="list-disc list-inside space-y-0.5 font-mono">
                        {result.missingVariables.map((v) => (
                          <li key={v}>{v}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : null}

              <div className="text-[11px] text-zinc-400 bg-zinc-950/50 p-2.5 rounded-md border border-zinc-800">
                <p>
                  <strong>Safety guarantee:</strong> This probe executes only non-destructive reads. It does not write test records, alter company data, or touch unrelated projects on the shared Firebase instance.
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
              <button
                onClick={runDiagnostics}
                disabled={running}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium transition disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${running ? 'animate-spin' : ''}`} />
                <span>Re-run Diagnostics</span>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="px-3 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
