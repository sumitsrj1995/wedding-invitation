import { useState } from 'react';
import { useUiStrings } from '../context/LanguageContext';

const initialState = {
  name: '',
  attending: 'yes',
  guests: '1',
  meal: 'Vegetarian',
  message: ''
};

export default function RSVPForm() {
  const ui = useUiStrings();
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const nextErrors = {};
    if (!formData.name.trim()) nextErrors.name = ui.rsvpNameRequired;
    if (!formData.guests) nextErrors.guests = ui.rsvpGuestsRequired;
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
  };

  return (
    <section id="rsvp" className="section-shell">
      <div className="section-title">{ui.rsvp}</div>
      {submitted ? (
        <div className="card" style={{ padding: '1.4rem' }}>
          <h3 style={{ marginTop: 0 }}>{ui.rsvpThankYouTitle}</h3>
          <p>{ui.rsvpThankYouMessage}</p>
        </div>
      ) : (
        <form className="card" onSubmit={handleSubmit} style={{ padding: '1.4rem', display: 'grid', gap: '1rem' }} noValidate>
          <div>
            <label htmlFor="name" className="text-smallcaps">{ui.name}</label>
            <input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%', marginTop: '0.35rem', padding: '0.8rem 0.9rem', borderRadius: '0.7rem', border: '1px solid rgba(184,147,90,0.35)', background: 'rgba(255,255,255,0.7)' }} />
            {errors.name ? <p style={{ margin: '0.35rem 0 0', color: 'var(--sage)' }}>{errors.name}</p> : null}
          </div>
          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
            <div>
              <label htmlFor="attending" className="text-smallcaps">{ui.attending}</label>
              <select id="attending" value={formData.attending} onChange={(e) => setFormData({ ...formData, attending: e.target.value })} style={{ width: '100%', marginTop: '0.35rem', padding: '0.8rem 0.9rem', borderRadius: '0.7rem', border: '1px solid rgba(184,147,90,0.35)', background: 'rgba(255,255,255,0.7)' }}>
                <option value="yes">{ui.yes}</option>
                <option value="no">{ui.no}</option>
              </select>
            </div>
            <div>
              <label htmlFor="guests" className="text-smallcaps">{ui.guests}</label>
              <input id="guests" type="number" min="1" max="4" value={formData.guests} onChange={(e) => setFormData({ ...formData, guests: e.target.value })} style={{ width: '100%', marginTop: '0.35rem', padding: '0.8rem 0.9rem', borderRadius: '0.7rem', border: '1px solid rgba(184,147,90,0.35)', background: 'rgba(255,255,255,0.7)' }} />
              {errors.guests ? <p style={{ margin: '0.35rem 0 0', color: 'var(--sage)' }}>{errors.guests}</p> : null}
            </div>
          </div>
          <div>
            <label htmlFor="meal" className="text-smallcaps">{ui.mealPreference}</label>
            <select id="meal" value={formData.meal} onChange={(e) => setFormData({ ...formData, meal: e.target.value })} style={{ width: '100%', marginTop: '0.35rem', padding: '0.8rem 0.9rem', borderRadius: '0.7rem', border: '1px solid rgba(184,147,90,0.35)', background: 'rgba(255,255,255,0.7)' }}>
              <option value="Vegetarian">{ui.mealVegetarian}</option>
              <option value="Chicken">{ui.mealChicken}</option>
              <option value="Fish">{ui.mealFish}</option>
              <option value="Vegan">{ui.mealVegan}</option>
            </select>
          </div>
          <div>
            <label htmlFor="message" className="text-smallcaps">{ui.message}</label>
            <textarea id="message" rows="4" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} style={{ width: '100%', marginTop: '0.35rem', padding: '0.8rem 0.9rem', borderRadius: '0.7rem', border: '1px solid rgba(184,147,90,0.35)', background: 'rgba(255,255,255,0.7)' }} />
          </div>
          <button type="submit" className="button" style={{ width: 'fit-content' }}>{ui.sendRsvp}</button>
        </form>
      )}
    </section>
  );
}
