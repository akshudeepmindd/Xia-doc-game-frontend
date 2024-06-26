import { Link } from '@tanstack/react-router';

const Logo = () => {
  return (
    <Link to="/">
      <img src="/logo.svg" className="w-16" />
    </Link>
  );
};

export default Logo;
