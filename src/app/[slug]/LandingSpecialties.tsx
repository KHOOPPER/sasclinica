'use client'

import { Stethoscope, Heart, Activity, Droplets, Baby, Scissors, Smile, Dna, FileSearch, Shield } from 'lucide-react'

// Simple map for icons based on text
const ICON_MAP: Record<string, any> = {
    '1': Stethoscope,
    '2': Droplets,
    '3': Heart,
    '4': Activity,
    '5': Shield,
    '6': Baby,
    '7': Scissors,
    '8': Smile,
    '9': Dna,
    '10': FileSearch
}

export function LandingSpecialties({ clinicData, primaryColor = '#0059bb' }: { clinicData: any, primaryColor?: string }) {
    
    // The visual editor provides the specialties array, or we fall back to defaults
    const specialties = clinicData.specialties || [
        { id: 's1', name: 'GINECOLOGÍA CLÍNICA', desc: 'Control y prevención integral de todas las patologías y condiciones que afectan a la mujer. Salud sexual y reproductiva.', icon: '1' },
        { id: 's2', name: 'ENDOCRINOLOGÍA GINECOLÓGICA Y FERTILIDAD', desc: 'Diagnóstico y tratamiento de la pareja estéril. Medicina reproductiva. Adolescencia, Menopausia y Climaterio.', icon: '2' },
        { id: 's3', name: 'MASTOLOGÍA', desc: 'Un enfoque multidisciplinario para la realización de un diagnóstico eficiente y tratamiento adecuado de las patologías mamarias.', icon: '3' },
        { id: 's4', name: 'ONCOLOGÍA GINECOLÓGICA', desc: 'Atención interdisciplinaria para el diagnóstico y tratamiento de las patologías oncológicas del sistema reproductor femenino.', icon: '4' },
        { id: 's5', name: 'UROGINECOLOGÍA', desc: 'Atención para el diagnóstico y tratamiento de trastornos del piso pélvico. Incontinencia Urinaria.', icon: '5' },
        { id: 's6', name: 'OBSTETRICIA Y MEDICINA FETAL', desc: 'Atención integral de la paciente en el embarazo, parto y puerperio. Asesoramiento en diagnóstico prenatal.', icon: '6' },
        { id: 's7', name: 'CIRUGÍA PLÁSTICA Y RECONSTRUCTIVA', desc: 'Conocimiento y experiencia al servicio del paciente para corregir o atenuar cualquier irregularidad.', icon: '7' },
        { id: 's8', name: 'DERMATOLOGÍA CLÍNICA Y ESTÉTICA', desc: 'Atención a las demandas y necesidades de los pacientes con patologías cutáneas con los mejores estándares.', icon: '8' },
        { id: 's9', name: 'GENÉTICA MÉDICA', desc: 'Diagnóstico y tratamiento genético para patologías hereditarias e investigación avanzada.', icon: '9' },
        { id: 's10', name: 'DIAGNÓSTICO POR IMÁGENES', desc: 'Recursos tecnológicos y humanos para la diagnosis: Mamografía, Ecografía, Radiología.', icon: '10' }
    ]

    const {
        specialties_title = 'Especialidades',
        show_specialties = true
    } = clinicData

    if (!show_specialties) return null

    return (
        <section id="especialidades" className="py-24 bg-white border-t border-slate-100">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 
                        className="text-4xl md:text-5xl font-medium tracking-tight mb-4 transition-colors"
                        style={{ color: primaryColor }}
                    >
                        {specialties_title}
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-6 gap-y-12">
                    {specialties.map((item: any, index: number) => {
                        const Icon = ICON_MAP[item.icon] || Stethoscope
                        return (
                            <div key={item.id || index} className="flex flex-col items-center text-center group">
                                <div 
                                    className="h-20 w-20 rounded-full flex items-center justify-center mb-6 transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl opacity-80 group-hover:opacity-100"
                                    style={{ backgroundColor: `${primaryColor}CC`, color: '#fff' }}
                                >
                                    <Icon className="h-10 w-10" strokeWidth={1.5} />
                                </div>
                                <h3 
                                    className="font-bold text-[13px] leading-snug uppercase tracking-wide mb-3 transition-colors px-2"
                                    style={{ color: primaryColor }}
                                >
                                    {item.name}
                                </h3>
                                <p className="text-slate-500 text-[13px] leading-relaxed mx-2">
                                    {item.desc}
                                </p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
