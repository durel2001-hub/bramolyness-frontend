import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/common/DashboardLayout';
import API from '../../api/axios';

export default function AdminCourseContent() {
  const [courses, setCourses] = useState([]);
  const [selected, setSelected] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [moduleForm, setModuleForm] = useState({ title:'', orderNumber:0 });
  const [lessonForm, setLessonForm] = useState({ title:'', videoUrl:'', content:'', pdfUrl:'', orderNumber:0 });
  const [selectedModule, setSelectedModule] = useState(null);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    API.get('/admin/courses').then(r => setCourses(r.data.courses || [])).catch(() => {});
  }, []);

  const loadCourse = (id) => {
    setSelected(id); setLoading(true);
    API.get(`/courses/${id}`).then(r => { setCourse(r.data.course); setLoading(false); }).catch(() => setLoading(false));
  };

  const addModule = async (e) => {
    e.preventDefault();
    await API.post('/admin/modules', { ...moduleForm, courseId: selected });
    loadCourse(selected); setShowModuleForm(false); setModuleForm({ title:'', orderNumber:0 });
    setMsg('Module added!'); setTimeout(() => setMsg(''), 3000);
  };

  const addLesson = async (e) => {
    e.preventDefault();
    await API.post('/admin/lessons', { ...lessonForm, moduleId: selectedModule });
    loadCourse(selected); setShowLessonForm(false); setLessonForm({ title:'', videoUrl:'', content:'', pdfUrl:'', orderNumber:0 });
    setMsg('Lesson added!'); setTimeout(() => setMsg(''), 3000);
  };

  const deleteModule = async (id) => {
    if (!window.confirm('Delete module and all its lessons?')) return;
    await API.delete(`/admin/modules/${id}`);
    loadCourse(selected);
  };

  const deleteLesson = async (id) => {
    if (!window.confirm('Delete lesson?')) return;
    await API.delete(`/admin/lessons/${id}`);
    loadCourse(selected);
  };

  return (
    <DashboardLayout>
      <h1 className="page-title">Course Content</h1>
      <p className="page-subtitle">Manage modules and lessons</p>
      {msg && <div className="alert alert-success">{msg}</div>}

      <div style={{ display:'grid', gridTemplateColumns:'280px 1fr', gap:24, alignItems:'start' }}>
        <div className="card" style={{ position:'sticky', top:24 }}>
          <h3 style={{ fontSize:16, color:'var(--primary)', marginBottom:14 }}>Select Course</h3>
          {courses.map(c => (
            <button key={c.id} onClick={() => loadCourse(c.id)} style={{
              display:'block', width:'100%', textAlign:'left', padding:'10px 12px', borderRadius:8, marginBottom:4, border:'none',
              background: selected===c.id ? 'var(--primary-light)' : 'transparent', color: selected===c.id ? 'white' : 'var(--text)',
              fontSize:14, cursor:'pointer', transition:'all 0.2s'
            }}>{c.title}</button>
          ))}
        </div>

        <div>
          {!selected && <div className="card" style={{ textAlign:'center', padding:60, color:'var(--text-muted)' }}><i className="fas fa-hand-point-left" style={{ fontSize:32, marginBottom:16, display:'block', opacity:0.3 }}></i>Select a course to manage content</div>}
          {loading && <div className="loading"><div className="spinner"></div></div>}
          {course && !loading && (
            <>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
                <h2 style={{ fontSize:20, color:'var(--primary)' }}>{course.title}</h2>
                <button onClick={() => setShowModuleForm(true)} className="btn btn-primary btn-sm"><i className="fas fa-plus"></i> Add Module</button>
              </div>
              {course.Modules?.map((mod, mi) => (
                <div key={mod.id} className="card" style={{ marginBottom:16 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
                    <h3 style={{ fontSize:16, fontFamily:'DM Sans', fontWeight:600, color:'var(--text)' }}>
                      <span style={{ color:'var(--text-muted)', marginRight:8 }}>M{mi+1}.</span>{mod.title}
                    </h3>
                    <div style={{ display:'flex', gap:8 }}>
                      <button onClick={() => { setSelectedModule(mod.id); setShowLessonForm(true); }} className="btn btn-outline btn-sm"><i className="fas fa-plus"></i> Lesson</button>
                      <button onClick={() => deleteModule(mod.id)} className="btn btn-danger btn-sm">Delete</button>
                    </div>
                  </div>
                  {mod.Lessons?.map((lesson, li) => (
                    <div key={lesson.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderTop:'1px solid var(--border)' }}>
                      <i className={`fas ${lesson.videoUrl ? 'fa-play-circle' : lesson.pdfUrl ? 'fa-file-pdf' : 'fa-file-alt'}`} style={{ color:'var(--text-muted)', width:20, textAlign:'center' }}></i>
                      <span style={{ flex:1, fontSize:14, color:'var(--text)' }}>{li+1}. {lesson.title}</span>
                      {lesson.videoUrl && <span style={{ fontSize:11, color:'var(--primary-light)', background:'#dbeafe', padding:'2px 8px', borderRadius:4 }}>Video</span>}
                      <button onClick={() => deleteLesson(lesson.id)} className="btn btn-danger btn-sm">×</button>
                    </div>
                  ))}
                  {(!mod.Lessons || mod.Lessons.length === 0) && <p style={{ color:'var(--text-muted)', fontSize:13, padding:'8px 0' }}>No lessons yet. Add a lesson above.</p>}
                </div>
              ))}
              {(!course.Modules || course.Modules.length === 0) && <div className="card" style={{ textAlign:'center', padding:32, color:'var(--text-muted)' }}>No modules yet. Click "Add Module" to start.</div>}
            </>
          )}
        </div>
      </div>

      {showModuleForm && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:2000 }}>
          <div style={{ background:'white', borderRadius:16, padding:32, width:440, boxShadow:'0 20px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:20 }}>
              <h2 style={{ fontSize:20, color:'var(--primary)' }}>Add Module</h2>
              <button onClick={() => setShowModuleForm(false)} style={{ background:'none', fontSize:22 }}>×</button>
            </div>
            <form onSubmit={addModule}>
              <div className="form-group"><label>Module Title *</label><input value={moduleForm.title} onChange={e => setModuleForm({...moduleForm, title: e.target.value})} required placeholder="e.g. Introduction to Cybersecurity" /></div>
              <div className="form-group"><label>Order Number</label><input type="number" value={moduleForm.orderNumber} onChange={e => setModuleForm({...moduleForm, orderNumber: e.target.value})} /></div>
              <div style={{ display:'flex', gap:12 }}>
                <button type="submit" className="btn btn-primary" style={{ flex:1, justifyContent:'center' }}>Add Module</button>
                <button type="button" onClick={() => setShowModuleForm(false)} className="btn btn-outline">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showLessonForm && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:2000, padding:24 }}>
          <div style={{ background:'white', borderRadius:16, padding:32, width:'100%', maxWidth:520, maxHeight:'90vh', overflowY:'auto', boxShadow:'0 20px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:20 }}>
              <h2 style={{ fontSize:20, color:'var(--primary)' }}>Add Lesson</h2>
              <button onClick={() => setShowLessonForm(false)} style={{ background:'none', fontSize:22 }}>×</button>
            </div>
            <form onSubmit={addLesson}>
              <div className="form-group"><label>Lesson Title *</label><input value={lessonForm.title} onChange={e => setLessonForm({...lessonForm, title: e.target.value})} required placeholder="e.g. What is Cyber Security?" /></div>
              <div className="form-group"><label>YouTube / Vimeo URL</label><input value={lessonForm.videoUrl} onChange={e => setLessonForm({...lessonForm, videoUrl: e.target.value})} placeholder="https://youtube.com/watch?v=..." /></div>
              <div className="form-group"><label>Lesson Content (Text)</label><textarea value={lessonForm.content} onChange={e => setLessonForm({...lessonForm, content: e.target.value})} rows={4} style={{ resize:'vertical' }} placeholder="Type lesson notes or content here..." /></div>
              <div className="form-group"><label>PDF URL (optional)</label><input value={lessonForm.pdfUrl} onChange={e => setLessonForm({...lessonForm, pdfUrl: e.target.value})} placeholder="https://example.com/file.pdf" /></div>
              <div className="form-group"><label>Order Number</label><input type="number" value={lessonForm.orderNumber} onChange={e => setLessonForm({...lessonForm, orderNumber: e.target.value})} /></div>
              <div style={{ display:'flex', gap:12 }}>
                <button type="submit" className="btn btn-primary" style={{ flex:1, justifyContent:'center' }}>Add Lesson</button>
                <button type="button" onClick={() => setShowLessonForm(false)} className="btn btn-outline">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
