
import MenuIcon from '@mui/icons-material/Menu';

const Header = ({ onToggleMenu }) => {
    return (
        <header className="bg-red-600 text-white flex items-center justify-between px-4 py-3 shadow">
            <button onClick={onToggleMenu} className="hover:bg-red-700 p-2 rounded">
                <MenuIcon />
            </button>
            <h1 className="text-xl font-semibold">Privacidad de Datos</h1>

        </header>
    );
};

export default Header;
