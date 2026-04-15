import { Layout, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <nav className="bg-[#002855] text-white p-4 shadow-lg border-b-4 border-[#ffcc00]">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                    <div className="bg-[#ffcc00] p-1.5 rounded-lg">
                        <Layout size={24} className="text-[#002855]" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">
                        Sira<span className="text-[#ffcc00]">Cell</span>
                    </span>
                </div>

                {token && (
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 hover:text-[#ffcc00] transition-colors"
                    >
                        <span className="text-sm font-medium text-gray-300">Çıkış</span>
                        <LogOut size={18} />
                    </button>
                )}
            </div>
        </nav>
    );
};