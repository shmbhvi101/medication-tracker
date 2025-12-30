// client/src/components/FamilyProfiles.jsx
import { useState } from 'react';
import { Users, Plus, X, Edit2, Trash2, Phone, Mail } from 'lucide-react';

function FamilyProfiles() {
  const [profiles, setProfiles] = useState(() => {
    const saved = localStorage.getItem('familyProfiles');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'You', relation: 'Self', age: '', phone: '', email: '' }
    ];
  });

  const [showAddProfile, setShowAddProfile] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    relation: 'Family Member',
    age: '',
    phone: '',
    email: ''
  });

  const saveProfiles = (newProfiles) => {
    setProfiles(newProfiles);
    localStorage.setItem('familyProfiles', JSON.stringify(newProfiles));
  };

  const handleAddProfile = () => {
    if (!formData.name.trim()) {
      alert('Please enter a name');
      return;
    }

    if (editingId) {
      const updated = profiles.map(p =>
        p.id === editingId ? { ...formData, id: editingId } : p
      );
      saveProfiles(updated);
      setEditingId(null);
    } else {
      const newProfile = {
        id: Date.now(),
        ...formData
      };
      saveProfiles([...profiles, newProfile]);
    }

    setFormData({ name: '', relation: 'Family Member', age: '', phone: '', email: '' });
    setShowAddProfile(false);
  };

  const handleEditProfile = (profile) => {
    setFormData(profile);
    setEditingId(profile.id);
    setShowAddProfile(true);
  };

  const handleDeleteProfile = (id) => {
    if (profiles.length === 1) {
      alert('You must have at least one profile');
      return;
    }
    if (confirm('Delete this profile?')) {
      saveProfiles(profiles.filter(p => p.id !== id));
    }
  };

  const handleCancel = () => {
    setShowAddProfile(false);
    setEditingId(null);
    setFormData({ name: '', relation: 'Family Member', age: '', phone: '', email: '' });
  };

  return (
    <div className="family-wrapper">
      <div className="family-container">
        <h2 className="section-title">👨‍👩‍👧 Family Profiles</h2>

        {/* Add Profile Modal */}
        {showAddProfile && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>{editingId ? 'Edit Profile' : 'Add Family Member'}</h3>
                <button className="modal-close" onClick={handleCancel}>
                  <X size={24} />
                </button>
              </div>

              <div className="form-section">
                <div className="form-group">
                  <label>Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter name"
                  />
                </div>

                <div className="form-group">
                  <label>Relation</label>
                  <select
                    value={formData.relation}
                    onChange={(e) => setFormData({ ...formData, relation: e.target.value })}
                  >
                    <option>Self</option>
                    <option>Spouse</option>
                    <option>Parent</option>
                    <option>Grandparent</option>
                    <option>Child</option>
                    <option>Sibling</option>
                    <option>Family Member</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Age</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    placeholder="Age"
                  />
                </div>

                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Phone number"
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Email address"
                  />
                </div>

                <div className="form-actions">
                  <button className="btn-secondary" onClick={handleCancel}>
                    Cancel
                  </button>
                  <button className="btn-primary" onClick={handleAddProfile}>
                    {editingId ? 'Update' : 'Add'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profiles Section */}
        <div className="profiles-section">
          <div className="section-header">
            <h3>Members ({profiles.length})</h3>
            <button 
              className="btn-add-profile"
              onClick={() => setShowAddProfile(true)}
            >
              <Plus size={20} /> Add Member
            </button>
          </div>

          <div className="profiles-list">
            {profiles.map(profile => (
              <div key={profile.id} className="profile-item">
                <div className="profile-avatar">
                  {profile.name.charAt(0).toUpperCase()}
                </div>

                <div className="profile-content">
                  <h4>{profile.name}</h4>
                  <p className="relation-tag">{profile.relation}</p>
                  
                  <div className="contact-info">
                    {profile.age && (
                      <span className="info-badge">Age: {profile.age}</span>
                    )}
                    {profile.phone && (
                      <span className="info-badge">
                        <Phone size={14} /> {profile.phone}
                      </span>
                    )}
                    {profile.email && (
                      <span className="info-badge">
                        <Mail size={14} /> {profile.email}
                      </span>
                    )}
                  </div>
                </div>

                <div className="profile-actions">
                  <button
                    className="action-btn edit"
                    onClick={() => handleEditProfile(profile)}
                    title="Edit"
                  >
                    <Edit2 size={18} />
                  </button>
                  {profiles.length > 1 && (
                    <button
                      className="action-btn delete"
                      onClick={() => handleDeleteProfile(profile.id)}
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Contacts */}
        {profiles.some(p => p.phone || p.email) && (
          <div className="contacts-section">
            <div className="section-header">
              <h3>📞 Quick Contacts</h3>
            </div>

            <div className="contacts-list">
              {profiles.filter(p => p.phone || p.email).map(profile => (
                <div key={profile.id} className="contact-card">
                  <div className="contact-name">{profile.name}</div>
                  <div className="contact-methods">
                    {profile.phone && (
                      <a href={`tel:${profile.phone}`} className="contact-link phone">
                        <Phone size={16} /> {profile.phone}
                      </a>
                    )}
                    {profile.email && (
                      <a href={`mailto:${profile.email}`} className="contact-link email">
                        <Mail size={16} /> {profile.email}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FamilyProfiles;