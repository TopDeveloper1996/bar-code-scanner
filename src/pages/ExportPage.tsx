import { ChevronLeft, Calendar } from 'lucide-react'
import { Link } from 'react-router-dom';


export default function ExportPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            <div className="px-5 py-6">
                <div className="flex items-center gap-2 mb-6">
                    <Link to="/" className="text-blue-500">
                        <ChevronLeft className="h-10 w-10 bg-[#eeeeee]/70 p-2 rounded-lg" />
                    </Link>
                </div>
                <h1 className="text-2xl font-semibold mb-4">Export Data</h1>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    <DateOption label="Today" className="col-span-2 md:col-span-1" />
                    <DateOption label="This Week" />
                    <DateOption label="This Month" />
                </div>

                <p className="text-sm text-gray-600 mb-4">Select a custom range</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <input
                        type="text"
                        placeholder="dd/mm/yyyy"
                        className="px-4 py-2 border rounded-lg"
                    />
                    <input
                        type="text"
                        placeholder="dd/mm/yyyy"
                        className="px-4 py-2 border rounded-lg"
                    />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <ExportOption type="CVS" color="green" />
                    <ExportOption type="PDF" color="orange" />
                </div>
            </div>
        </div>
    )
}

function DateOption({ label, className = '' }: { label: string, className?: string }) {
    return (
        <div className={`bg-gray-50 rounded-xl p-4 flex flex-col items-center ${className}`}>
            <Calendar className="h-6 w-6 text-blue-500 mb-2" />
            <span className="text-sm">{label}</span>
        </div>
    )
}

function ExportOption({ type, color }: { type: string; color: 'green' | 'orange' }) {
    const bgColor = color === 'green' ? 'bg-green-100' : 'bg-orange-100'
    const textColor = color === 'green' ? 'text-green-500' : 'text-orange-500'

    return (
        <div className="bg-gray-50 rounded-xl p-6 flex flex-col items-center">
            <div className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center mb-2`}>
                <svg className={`h-6 w-6 ${textColor}`} viewBox="0 0 24 24" fill="none">
                    {type === 'CVS' ? (
                        <path d="M4 6h16M4 10h16M4 14h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    ) : (
                        <path d="M12 14l9-5-9-5-9 5 9 5z" stroke="currentColor" strokeWidth="2" />
                    )}
                </svg>
            </div>
            <span>{type}</span>
        </div>
    )
}

