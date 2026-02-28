'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import logo from './logo.png';

// Custom Select Component for Gaming Aesthetic
const CustomSelect = ({ label, name, options, value, onChange, placeholder = "Seleccione" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    onChange({ target: { name, value: optionValue } });
    setIsOpen(false);
  };

  const selectedLabel = options.find(opt => opt.value === value)?.label || placeholder;

  return (
    <div className="form-group">
      <label>{label}</label>
      <div className="custom-select-container" ref={containerRef}>
        <div
          className={`custom-select-trigger ${isOpen ? 'open' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>{selectedLabel}</span>
          <div className="chevron"></div>
        </div>

        {isOpen && (
          <div className="custom-select-options">
            {options.map((option) => (
              <div
                key={option.value}
                className={`custom-option ${value === option.value ? 'selected' : ''}`}
                onClick={() => handleSelect(option.value)}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default function Home() {
  const [formData, setFormData] = useState({
    nombre: '',
    edad: '',
    conoceNormas: '',
    accionPersecucion: '',
    abusoPoder: '',
    cadenaMando: '',
    usoArmamento: '',
    aceptaSanciones: '',
    experiencia: '',
    motivo: ''
  });

  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation for custom selects
    const requiredSelects = ['edad', 'accionPersecucion', 'cadenaMando', 'usoArmamento', 'experiencia'];
    for (const field of requiredSelects) {
      if (!formData[field]) {
        setStatus({ type: 'error', message: `Por favor, selecciona una opción para: ${field}` });
        return;
      }
    }

    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    const webhookUrl = 'https://discord.com/api/webhooks/1477317129840758958/5n5KfN2tSAwa53S83Oj6MVoyZ5qHUzYInD38dVFrVLGl0_olW2UVxQqbS3G6Tsz94J1c';

    // Build the Discord Embed
    const embed = {
      title: '📋 Nuevo Formulario Policial Recibido',
      color: 0x00f2ff, // Neon Cyan
      timestamp: new Date().toISOString(),
      fields: [
        { name: '👤 Nombre', value: formData.nombre || 'No proporcionado', inline: true },
        { name: '🎂 Edad', value: formData.edad || 'No proporcionado', inline: true },
        { name: '📜 Conoce Normas', value: formData.conoceNormas || 'No proporcionado', inline: true },
        { name: '🏎️ Persecución', value: formData.accionPersecucion || 'No proporcionado', inline: true },
        { name: '🚫 Abuso Poder', value: formData.abusoPoder || 'No proporcionado', inline: true },
        { name: '🫡 Cadena Mando', value: formData.cadenaMando || 'No proporcionado', inline: true },
        { name: '🔫 Armamento', value: formData.usoArmamento || 'No proporcionado', inline: true },
        { name: '⚖️ Sanciones', value: formData.aceptaSanciones || 'No proporcionado', inline: true },
        { name: '⭐ Experiencia', value: formData.experiencia || 'No proporcionado', inline: true },
        { name: '📝 Motivo', value: formData.motivo || 'No proporcionado' }
      ],
      footer: {
        text: 'Sistema de Reclutamiento - Palanqueo RP'
      }
    };

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ embeds: [embed] })
      });

      if (response.ok) {
        setStatus({ type: 'success', message: '¡Formulario enviado con éxito, agente!' });
        setFormData({
          nombre: '',
          edad: '',
          conoceNormas: '',
          accionPersecucion: '',
          abusoPoder: '',
          cadenaMando: '',
          usoArmamento: '',
          aceptaSanciones: '',
          experiencia: '',
          motivo: ''
        });
      } else {
        throw new Error('Error al enviar al servidor central.');
      }
    } catch (error) {
      console.error(error);
      setStatus({ type: 'error', message: 'ERROR CRÍTICO: Fallo en la conexión con el servidor.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="container">
      <div className="form-header">
        <div className="logo-container">
          <Image
            src={logo}
            alt="Palanqueo RP Logo"
            width={500}
            height={500}
            className="main-logo"
            priority
          />
        </div>
        <h1>Formulario Policial Nacional</h1>
        <p className="header-subtitle">
          Unidad de Reclutamiento y Selección • Palanqueo RP
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Field 1 */}
        <div className="form-group">
          <label htmlFor="nombre">Nombre completo del aspirante</label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            placeholder="Introduce tu nombre IC..."
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>

        {/* Field 2 */}
        <CustomSelect
          label="Edad"
          name="edad"
          value={formData.edad}
          onChange={handleChange}
          options={[
            { value: "18 - 25", label: "18 - 25 años" },
            { value: "26 - 35", label: "26 - 35 años" },
            { value: "36 - 45", label: "36 - 45 años" },
            { value: "46+", label: "Más de 46 años" }
          ]}
        />

        {/* Field 3 */}
        <div className="form-group">
          <label>¿Conoce las normas del rol policial?</label>
          <div className="radio-group">
            <label className="radio-item">
              <input
                type="radio"
                name="conoceNormas"
                value="Sí"
                checked={formData.conoceNormas === 'Sí'}
                onChange={handleChange}
                required
              />
              Sí
            </label>
            <label className="radio-item">
              <input
                type="radio"
                name="conoceNormas"
                value="No"
                checked={formData.conoceNormas === 'No'}
                onChange={handleChange}
                required
              />
              No
            </label>
          </div>
        </div>

        {/* Field 4 */}
        <CustomSelect
          label="¿Qué haría ante una persecución?"
          name="accionPersecucion"
          value={formData.accionPersecucion}
          onChange={handleChange}
          options={[
            { value: "Solicitar refuerzos", label: "Solicitar refuerzos" },
            { value: "Disparar sin aviso", label: "Disparar sin aviso" },
            { value: "Perder al sospechoso", label: "Perder al sospechoso" }
          ]}
        />

        {/* Field 5 */}
        <div className="form-group">
          <label>¿Está permitido el abuso de poder?</label>
          <div className="radio-group">
            <label className="radio-item">
              <input
                type="radio"
                name="abusoPoder"
                value="Sí"
                checked={formData.abusoPoder === 'Sí'}
                onChange={handleChange}
                required
              />
              Sí
            </label>
            <label className="radio-item">
              <input
                type="radio"
                name="abusoPoder"
                value="No"
                checked={formData.abusoPoder === 'No'}
                onChange={handleChange}
                required
              />
              No
            </label>
          </div>
        </div>

        {/* Field 6 */}
        <CustomSelect
          label="¿Respeta la cadena de mando?"
          name="cadenaMando"
          value={formData.cadenaMando}
          onChange={handleChange}
          options={[
            { value: "Siempre", label: "Siempre" },
            { value: "A veces", label: "A veces" },
            { value: "Nunca", label: "Nunca" }
          ]}
        />

        {/* Field 7 */}
        <CustomSelect
          label="¿Uso correcto del armamento?"
          name="usoArmamento"
          value={formData.usoArmamento}
          onChange={handleChange}
          options={[
            { value: "Solo en situaciones necesarias", label: "Solo en situaciones necesarias" },
            { value: "En cualquier momento", label: "En cualquier momento" }
          ]}
        />

        {/* Field 8 */}
        <div className="form-group">
          <label>¿Acepta sanciones si incumple normas?</label>
          <div className="radio-group">
            <label className="radio-item">
              <input
                type="radio"
                name="aceptaSanciones"
                value="Sí"
                checked={formData.aceptaSanciones === 'Sí'}
                onChange={handleChange}
                required
              />
              Sí
            </label>
            <label className="radio-item">
              <input
                type="radio"
                name="aceptaSanciones"
                value="No"
                checked={formData.aceptaSanciones === 'No'}
                onChange={handleChange}
                required
              />
              No
            </label>
          </div>
        </div>

        {/* Field 9 */}
        <CustomSelect
          label="Experiencia previa en roles policiales"
          name="experiencia"
          value={formData.experiencia}
          onChange={handleChange}
          options={[
            { value: "Ninguna", label: "Ninguna" },
            { value: "Básica", label: "Básica" },
            { value: "Avanzada", label: "Avanzada" }
          ]}
        />

        {/* Field 10 */}
        <div className="form-group">
          <label htmlFor="motivo">¿Por qué quiere ingresar a la Policía Nacional?</label>
          <textarea
            id="motivo"
            name="motivo"
            rows="4"
            placeholder="Explica tus motivos aquí..."
            value={formData.motivo}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          className="submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'ENVIANDO...' : 'ENVIAR FORMULARIO'}
        </button>

        {status.message && (
          <div className={`feedback ${status.type}`}>
            {status.message}
          </div>
        )}
      </form>

      <footer style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-dim)', borderTop: '1px solid var(--surface-border)', paddingTop: '1rem' }}>
        © {new Date().getFullYear()} Policía Nacional - Palanqueo RP | Formulario Oficial
      </footer>
    </main>
  );
}
