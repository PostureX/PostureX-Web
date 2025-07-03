import "./Header.css";

export default function Header() {
    return <div className="header-bar">
        <img className="spf-crest" src="/images/spf_crest_with_tagline.png" alt="Logo" />
        <img className="logo" src="/images/logo.svg" alt="Logo" />
        <div className="nav">
            <a href="/">Home</a>
            <a href="/upload">Upload</a>
            <a href="/logout">Logout</a>
            <a href="/profile">
                <div className="profile-logo"></div>
            </a>
        </div>
    </div>
}