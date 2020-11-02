const Footer = ({ currentUser }) => {
  return (
    <nav className="navbar navbar-light bg-light">
      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">{currentUser?.email}</ul>
      </div>
    </nav>
  );
};

export default Footer;
