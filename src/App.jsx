import React, { useState, useEffect } from 'react';
import { Home, Library, Info, Save, Play, Trash2, Plus, ExternalLink } from 'lucide-react';

const App = () => {
  const [activeTab, setActiveTab] = useState('editor');
  const [activity, setActivity] = useState({
    clientId: '',
    type: 0, // 0: Playing, 1: Streaming, 2: Listening, 3: Watching, 5: Competing
    details: 'Editing an activity',
    state: 'In the editor',
    largeImageKey: '',
    largeImageText: '',
    smallImageKey: '',
    smallImageText: '',
    button1Label: '',
    button1Url: '',
    button2Label: '',
    button2Url: '',
    streamUrl: '',
    layoutName: '',
  });

  const [library, setLibrary] = useState([]);
  const [showGuide, setShowGuide] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [showSaveModal, setShowSaveModal] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('discord_library');
    if (saved) setLibrary(JSON.parse(saved));
    
    const firstTime = !localStorage.getItem('visited');
    if (firstTime) {
      setShowGuide(true);
      localStorage.setItem('visited', 'true');
    }
  }, []);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const saveToLibrary = () => {
    const name = activity.layoutName || `Layout ${library.length + 1}`;
    const newLibrary = [...library, { ...activity, id: Date.now(), name }];
    setLibrary(newLibrary);
    localStorage.setItem('discord_library', JSON.stringify(newLibrary));
    setActivity({...activity, layoutName: ''});
    setShowSaveModal(false);
    showToast(`Layout "${name}" saved!`);
  };

  const deleteFromLibrary = (id) => {
    const newLibrary = library.filter(item => item.id !== id);
    setLibrary(newLibrary);
    localStorage.setItem('discord_library', JSON.stringify(newLibrary));
    showToast('Layout deleted', 'error');
  };

  const applyActivity = async () => {
    if (!activity.clientId) {
      showToast('Please enter a Client ID', 'error');
      return;
    }
    
    const buttons = [];
    if (activity.button1Label && activity.button1Url) {
      buttons.push({ label: activity.button1Label, url: activity.button1Url });
    }
    if (activity.button2Label && activity.button2Url) {
      buttons.push({ label: activity.button2Label, url: activity.button2Url });
    }

    const activityPayload = {
      details: activity.details || undefined,
      state: activity.state || undefined,
      startTimestamp: Date.now(),
      instance: false,
      type: parseInt(activity.type),
      url: activity.type === 1 ? activity.streamUrl : undefined,
    };

    if (activity.largeImageKey) activityPayload.largeImageKey = activity.largeImageKey;
    if (activity.largeImageText) activityPayload.largeImageText = activity.largeImageText;
    if (activity.smallImageKey) activityPayload.smallImageKey = activity.smallImageKey;
    if (activity.smallImageText) activityPayload.smallImageText = activity.smallImageText;
    if (buttons.length > 0) activityPayload.buttons = buttons;

    const payload = {
      clientId: activity.clientId,
      activity: activityPayload
    };

    if (window.electronAPI) {
      const result = await window.electronAPI.setActivity(payload);
      if (!result.success) {
        showToast('Error: ' + result.error, 'error');
      } else {
        showToast('Activity applied successfully!');
      }
    } else {
      showToast('Preview Mode: RPC only works in the desktop app.', 'error');
    }
  };

  const openBrowser = (url) => {
    if (window.electronAPI?.openExternal) {
      window.electronAPI.openExternal(url);
    } else {
      window.open(url, '_blank');
    }
  };

  const Logo = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
      <div className="glass" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--primary-gradient)' }}>
        <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
          <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.864-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3855-.4051-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1811.3712-.2769a.0743.0743 0 01.0776-.0104c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0775.0104c.1256.0958.2455.1887.3712.2769a.077.077 0 01-.0066.1277 12.2986 12.2986 0 01-1.873.8923.076.076 0 00-.0416.1057c.3604.699.7719 1.3638 1.2148 1.9942a.077.077 0 00.0843.0276c1.961-.6066 3.9495-1.5218 6.0023-3.0294a.077.077 0 00.0313-.0561c.5004-5.177-.8382-9.6739-3.5435-13.6603a.0668.0668 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
        </svg>
      </div>
      <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--primary)' }}>Activity Editor</span>
    </div>
  );

  const TitleBar = () => (
    <div className="titlebar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', opacity: 0.6 }}>
        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
          <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.864-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3855-.4051-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1811.3712-.2769a.0743.0743 0 01.0776-.0104c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0775.0104c.1256.0958.2455.1887.3712.2769a.077.077 0 01-.0066.1277 12.2986 12.2986 0 01-1.873.8923.076.076 0 00-.0416.1057c.3604.699.7719 1.3638 1.2148 1.9942a.077.077 0 00.0843.0276c1.961-.6066 3.9495-1.5218 6.0023-3.0294a.077.077 0 00.0313-.0561c.5004-5.177-.8382-9.6739-3.5435-13.6603a.0668.0668 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
        </svg>
        Simple Discord Activity Editor
      </div>
      <div className="titlebar-controls">
        <div className="titlebar-btn" onClick={() => window.electronAPI?.minimize()}>
          <svg width="12" height="1" viewBox="0 0 12 1" fill="white"><rect width="12" height="1"/></svg>
        </div>
        <div className="titlebar-btn" onClick={() => window.electronAPI?.maximize()}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="white"><rect x="0.5" y="0.5" width="9" height="9"/></svg>
        </div>
        <div className="titlebar-btn close" onClick={() => window.electronAPI?.close()}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="white">
            <path d="M0.707 0L0 0.707L4.293 5L0 9.293L0.707 10L5 5.707L9.293 10L10 9.293L5.707 5L10 0.707L9.293 0L5 4.293L0.707 0Z"/>
          </svg>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <TitleBar />
      <div className="container">
        {/* Sidebar */}
        <nav className="sidebar">
          <Logo />
          <div style={{ display: 'grid', gap: '12px' }}>
            <button onClick={() => setActiveTab('editor')} className={`btn ${activeTab === 'editor' ? 'btn-primary' : 'btn-ghost'}`}>
              <Home size={18} /> Editor
            </button>
            <button onClick={() => setActiveTab('library')} className={`btn ${activeTab === 'library' ? 'btn-primary' : 'btn-ghost'}`}>
              <Library size={18} /> Library
            </button>
            <button onClick={() => setShowGuide(true)} className="btn btn-ghost">
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Info size={18} /> Setup Guide</span>
            </button>
          </div>
          <div style={{ marginTop: 'auto', padding: '20px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Version 1.3.0<br/>By BlueDev
          </div>
        </nav>

        {/* Main Content */}
        <main className="main-content">
          {activeTab === 'editor' ? (
            <div className="animate-fade">
              <h1 style={{ marginBottom: '32px' }}>Presence Editor</h1>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="input-group">
                  <label>Discord Client ID</label>
                  <input 
                    placeholder="1234567890..." 
                    value={activity.clientId} 
                    onChange={(e) => setActivity({...activity, clientId: e.target.value})}
                  />
                </div>
                <div className="input-group">
                  <label>Activity Type</label>
                  <select 
                    style={{ width: '100%', padding: '12px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }}
                    value={activity.type}
                    onChange={(e) => setActivity({...activity, type: e.target.value})}
                  >
                    <option value="0">Playing</option>
                    <option value="1">Streaming</option>
                    <option value="2">Listening</option>
                    <option value="3">Watching</option>
                    <option value="5">Competing</option>
                  </select>
                </div>
              </div>

              {activity.type === '1' && (
                <div className="input-group animate-fade">
                  <label>Streaming URL (Twitch/YouTube)</label>
                  <input placeholder="https://twitch.tv/..." value={activity.streamUrl} onChange={(e) => setActivity({...activity, streamUrl: e.target.value})} />
                </div>
              )}

              <div className="glass" style={{ padding: '20px', display: 'grid', gap: '15px' }}>
                <div>
                  <label>Details (Top Line)</label>
                  <input value={activity.details} onChange={(e) => setActivity({...activity, details: e.target.value})} />
                </div>
                <div>
                  <label>State (Bottom Line)</label>
                  <input value={activity.state} onChange={(e) => setActivity({...activity, state: e.target.value})} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '10px' }}>
                <div className="glass" style={{ padding: '20px' }}>
                  <label>Large Image</label>
                  <input placeholder="Key from assets" value={activity.largeImageKey} onChange={(e) => setActivity({...activity, largeImageKey: e.target.value})} style={{ marginBottom: '10px' }} />
                  <input placeholder="Image text" value={activity.largeImageText} onChange={(e) => setActivity({...activity, largeImageText: e.target.value})} />
                </div>
                <div className="glass" style={{ padding: '20px' }}>
                  <label>Small Image</label>
                  <input placeholder="Key from assets" value={activity.smallImageKey} onChange={(e) => setActivity({...activity, smallImageKey: e.target.value})} style={{ marginBottom: '10px' }} />
                  <input placeholder="Image text" value={activity.smallImageText} onChange={(e) => setActivity({...activity, smallImageText: e.target.value})} />
                </div>
              </div>

              <div style={{ marginTop: '20px', padding: '20px' }} className="glass">
                <label>Buttons</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px', marginBottom: '10px' }}>
                  <input placeholder="Label 1" value={activity.button1Label} onChange={(e) => setActivity({...activity, button1Label: e.target.value})} />
                  <input placeholder="URL 1" value={activity.button1Url} onChange={(e) => setActivity({...activity, button1Url: e.target.value})} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px' }}>
                  <input placeholder="Label 2" value={activity.button2Label} onChange={(e) => setActivity({...activity, button2Label: e.target.value})} />
                  <input placeholder="URL 2" value={activity.button2Url} onChange={(e) => setActivity({...activity, button2Url: e.target.value})} />
                </div>
              </div>

              <div style={{ marginTop: '30px', display: 'flex', gap: '12px' }}>
                <button className="btn btn-primary" onClick={applyActivity}>
                  <Play size={18} fill="currentColor" /> Apply Activity
                </button>
                <button className="btn btn-ghost" onClick={() => setShowSaveModal(true)} style={{ marginLeft: 'auto' }}>
                  <Save size={18} /> Save Layout
                </button>
              </div>
            </div>
          ) : (
            <div className="animate-fade">
              <h1 style={{ marginBottom: '32px' }}>Layout Library</h1>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                {library.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No layouts saved yet.</p>}
                {library.map((item) => (
                  <div key={item.id} className="glass" style={{ padding: '24px', position: 'relative', borderLeft: '4px solid var(--primary)' }}>
                    <h3 style={{ marginBottom: '8px' }}>{item.name}</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>{item.details || 'No details'}</p>
                    <div style={{ display: 'flex', gap: '4px', fontSize: '0.7rem', opacity: 0.6, marginBottom: '20px' }}>
                      <span className="glass" style={{ padding: '2px 8px' }}>Type: {['Playing', 'Streaming', 'Listening', 'Watching', '', 'Competing'][item.type || 0]}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button className="btn btn-primary" style={{ flex: 1, padding: '8px', fontSize: '0.85rem', justifyContent: 'center' }} onClick={() => { setActivity(item); setActiveTab('editor'); }}>
                        Load Layout
                      </button>
                      <button className="btn btn-ghost" style={{ padding: '8px', color: '#ef4444' }} onClick={() => deleteFromLibrary(item.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>

        {/* Preview Pane */}
        <aside className="preview-pane">
          <label style={{ marginBottom: '24px', display: 'block' }}>Live Preview</label>
          <div className="animate-fade" style={{ background: '#111214', borderRadius: '12px', padding: '20px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
            <div style={{ color: 'white', fontWeight: 'bold', fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: '16px', opacity: 0.5, letterSpacing: '0.1em' }}>
              {['Playing a game', 'Streaming', 'Listening to', 'Watching', '', 'Competing in'][activity.type || 0]}
            </div>
            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{ position: 'relative' }}>
                <div style={{ width: '80px', height: '80px', background: '#2b2d31', borderRadius: '12px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                  {activity.largeImageKey ? 
                    <img src={`/assets/placeholder.png`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : 
                    <Plus size={32} opacity={0.2} />
                  }
                </div>
                {activity.smallImageKey && (
                  <div style={{ position: 'absolute', bottom: '-6px', right: '-6px', width: '32px', height: '32px', background: '#111214', borderRadius: '50%', padding: '4px' }}>
                    <div style={{ width: '100%', height: '100%', background: '#2b2d31', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.05)' }}></div>
                  </div>
                )}
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontWeight: '700', fontSize: '1rem', color: '#fff', marginBottom: '4px' }}>Your App Name</div>
                <div style={{ fontSize: '0.9rem', color: '#dbdee1', marginBottom: '2px' }}>{activity.details || 'Writing something cool...'}</div>
                <div style={{ fontSize: '0.9rem', color: '#dbdee1' }}>{activity.state || 'Busy editing'}</div>
              </div>
            </div>
            <div style={{ marginTop: '20px', display: 'grid', gap: '10px' }}>
              {activity.button1Label && <div style={{ background: '#4e5058', color: 'white', textAlign: 'center', padding: '8px', borderRadius: '4px', fontSize: '0.9rem', fontWeight: '500', cursor: 'pointer', transition: '0.2s' }}>{activity.button1Label}</div>}
              {activity.button2Label && <div style={{ background: '#4e5058', color: 'white', textAlign: 'center', padding: '8px', borderRadius: '4px', fontSize: '0.9rem', fontWeight: '500', cursor: 'pointer', transition: '0.2s' }}>{activity.button2Label}</div>}
            </div>
          </div>
        </aside>

        {/* Onboarding Guide Overlay */}
        {showGuide && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <div className="glass animate-fade" style={{ maxWidth: '600px', width: '100%', padding: '40px', maxHeight: '90vh', overflowY: 'auto' }}>
              <h1 style={{ color: 'var(--primary)', marginBottom: '20px' }}>Welcome! 🚀</h1>
              <p style={{ marginBottom: '20px', lineHeight: '1.6' }}>To use this software, you need to create a Discord Application. Follow these steps:</p>
              <ol style={{ paddingLeft: '20px', display: 'grid', gap: '16px' }}>
                <li>Go to the <span onClick={(e) => { e.preventDefault(); openBrowser('https://discord.com/developers/applications'); }} style={{ color: 'var(--accent)', cursor: 'pointer', textDecoration: 'underline' }}>Discord Developer Portal <ExternalLink size={14} /></span>.</li>
                <li>Click <b>"New Application"</b> and give it a cool name (this name will appear in your status).</li>
                <li>In the <b>"General Information"</b> tab, copy your <b>"APPLICATION ID"</b>. Paste it into the <b>Client ID</b> field in this editor.</li>
                <li>Go to <b>"Rich Presence" &rarr; "Art Assets"</b> to upload images. Use the names you give them as "Keys" in this editor.</li>
                <li>Make sure Discord is open on your computer!</li>
              </ol>
              <button className="btn btn-primary" style={{ marginTop: '30px', width: '100%', justifyContent: 'center' }} onClick={() => setShowGuide(false)}>
                Got it, let's go!
              </button>
            </div>
          </div>
        )}

        {/* Global Toast Container */}
        <div className="toast-container">
          {toasts.map(t => (
            <div key={t.id} className={`toast ${t.type === 'error' ? 'error' : ''}`}>
              {t.type === 'error' ? '❌' : '✅'} {t.message}
            </div>
          ))}
        </div>

        {/* Save Layout Modal */}
        {showSaveModal && (
          <div className="modal-overlay" onClick={() => setShowSaveModal(false)}>
            <div className="glass modal animate-fade" onClick={e => e.stopPropagation()}>
              <h2>Save Layout</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Give your layout a name to find it easily later.</p>
              <input 
                autoFocus
                placeholder="My Awesome Status..." 
                value={activity.layoutName} 
                onChange={(e) => setActivity({...activity, layoutName: e.target.value})}
                onKeyDown={(e) => e.key === 'Enter' && saveToLibrary()}
                style={{ marginTop: '10px' }}
              />
              <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                <button className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowSaveModal(false)}>Cancel</button>
                <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={saveToLibrary}>Save</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default App;
