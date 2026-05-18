'use client'

import React from 'react'
import { Stethoscope, Award, Star, ExternalLink } from 'lucide-react'

interface TeamMember {
  id?: string
  name: string
  specialty?: string
  role?: string
  avatar_url?: string
  bio?: string
}

interface LandingTeamProps {
  clinicData: any
  staff?: TeamMember[]
}

export function LandingTeam({ clinicData, staff = [] }: LandingTeamProps) {
  const variant = clinicData.team_variant || 'cards'
  const title = clinicData.team_title || 'Nuestro Equipo'
  const subtitle = clinicData.team_subtitle || 'Profesionales comprometidos con tu salud'
  const primary = clinicData.primary_color || '#2563eb'

  // Merge: manual team data OR fetched staff from DB
  const members: TeamMember[] = (clinicData.team_members_data?.length
    ? clinicData.team_members_data
    : staff
  )

  if (!members.length) {
    return (
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-sm text-slate-400">Agrega miembros del equipo desde el editor o gestiona el staff en el panel de administración.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 overflow-hidden" style={{ backgroundColor: clinicData.bg_secondary || '#f8fafc' }}>
      {/* Header */}
      <div className="max-w-6xl mx-auto px-6 mb-14 text-center">
        <p className="text-xs font-black uppercase tracking-[0.3em] mb-3" style={{ color: primary }}>
          EQUIPO MÉDICO
        </p>
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">{title}</h2>
        <p className="text-slate-500 max-w-lg mx-auto">{subtitle}</p>
      </div>

      {/* ── CARDS variant ── */}
      {variant === 'cards' && (
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {members.map((m, i) => (
            <div key={m.id || i} className="group bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 hover:-translate-y-1">
              {/* Avatar */}
              <div className="h-48 relative overflow-hidden" style={{ backgroundColor: `${primary}15` }}>
                {m.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.avatar_url} alt={m.name} className="w-full h-full object-cover object-top" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl font-black" style={{ backgroundColor: `${primary}25`, color: primary }}>
                      {m.name.charAt(0)}
                    </div>
                  </div>
                )}
                {/* Specialty badge */}
                {(m.specialty || m.role) && (
                  <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-1.5 flex items-center gap-1.5">
                    <Stethoscope size={11} style={{ color: primary }} />
                    <span className="text-[10px] font-bold text-slate-700 truncate">{m.specialty || m.role}</span>
                  </div>
                )}
              </div>
              {/* Info */}
              <div className="p-5">
                <h3 className="font-black text-slate-900 text-sm mb-1">{m.name}</h3>
                {m.bio && <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{m.bio}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── HORIZONTAL list ── */}
      {variant === 'horizontal' && (
        <div className="max-w-4xl mx-auto px-6 space-y-4">
          {members.map((m, i) => (
            <div key={m.id || i} className="flex items-center gap-5 bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all border border-slate-100">
              {/* Avatar */}
              <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0" style={{ backgroundColor: `${primary}15` }}>
                {m.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.avatar_url} alt={m.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl font-black" style={{ color: primary }}>
                    {m.name.charAt(0)}
                  </div>
                )}
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-black text-slate-900">{m.name}</h3>
                {(m.specialty || m.role) && (
                  <p className="text-xs font-bold" style={{ color: primary }}>{m.specialty || m.role}</p>
                )}
                {m.bio && <p className="text-xs text-slate-500 mt-1 line-clamp-1">{m.bio}</p>}
              </div>
              <Star size={14} className="text-amber-400 shrink-0" fill="currentColor" />
            </div>
          ))}
        </div>
      )}

      {/* ── ELITE variant ── */}
      {variant === 'elite' && (
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10">
          {members.map((m, i) => (
            <div key={m.id || i} className="flex gap-8 items-center bg-white p-8 rounded-[3rem] shadow-sm hover:shadow-2xl transition-all group">
              <div className="w-40 h-56 rounded-[2rem] overflow-hidden shrink-0 shadow-lg">
                {m.avatar_url ? (
                  <img src={m.avatar_url} alt={m.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-black bg-slate-50 text-slate-200">
                    {m.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-2" style={{ color: primary }}>{m.specialty || m.role || 'Médico Especialista'}</p>
                <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tighter">{m.name}</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-6 italic">"{m.bio || 'Comprometido con la excelencia médica y el cuidado humano de cada paciente.'}"</p>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-all cursor-pointer"><Star size={14} /></div>
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-all cursor-pointer"><Award size={14} /></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── MINIMAL grid ── */}
      {(variant === 'minimal' || variant === 'list' || variant === 'circles') && (
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 text-center">
          {members.map((m, i) => (
            <div key={m.id || i} className="group space-y-3">
              {/* Avatar circle */}
              <div className="w-20 h-20 mx-auto rounded-full overflow-hidden ring-4 ring-white shadow-lg" style={{ backgroundColor: `${primary}20` }}>
                {m.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.avatar_url} alt={m.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl font-black" style={{ color: primary }}>
                    {m.name.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-sm">{m.name}</h3>
                {(m.specialty || m.role) && (
                  <p className="text-[11px] font-bold mt-0.5" style={{ color: primary }}>{m.specialty || m.role}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
