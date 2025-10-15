"use client";
import styled from "styled-components";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";

const Nav = styled.nav`
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #334155;
  position: sticky;
  top: 0;
  z-index: 1000;
  padding: 0 1rem;
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(-45deg, #0ea5e9, #8b5cf6, #ec4899, #0ea5e9);
  background-size: 400% 400%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  animation: gradientShift 8s ease infinite;

  @keyframes gradientShift {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`;

const LogoIcon = styled.span`
  font-size: 1.75rem;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)<{ $isActive?: boolean }>`
  color: ${(props) => (props.$isActive ? "#0ea5e9" : "#cbd5e1")};
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
  padding: 0.5rem 0;

  &:hover {
    color: #0ea5e9;
  }

  ${(props) =>
    props.$isActive &&
    `
    &::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 0;
      width: 100%;
      height: 2px;
      background: linear-gradient(90deg, #0ea5e9, #8b5cf6);
      border-radius: 2px;
    }
  `}
`;

const GradientButton = styled(Link)`
  background: #a84eff;
  background-size: 400% 400%;
  border: 1px solid rgba(139, 92, 246, 0.3);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  animation: gradientShift 8s ease infinite;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(139, 92, 246, 0.3);
    border-color: rgba(139, 92, 246, 0.6);
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
    );
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }

  @keyframes gradientShift {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`;

const SecondaryGradientButton = styled(Link)`
  background: transparent;
  border: 1px solid;
  border-image: linear-gradient(45deg, #0ea5e9, #8b5cf6) 1;
  color: #cbd5e1;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    background: linear-gradient(
      45deg,
      rgba(14, 165, 233, 0.1),
      rgba(139, 92, 246, 0.1)
    );
    color: white;
    transform: translateY(-1px);
  }
`;

const UserMenu = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
`;

const UserAvatar = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: linear-gradient(45deg, #8b5cf6, #0ea5e9);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  transition: transform 0.2s ease;

  ${UserMenu}:hover & {
    transform: scale(1.05);
  }
`;

const UserDropdown = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: rgba(30, 41, 59, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 12px;
  padding: 0.75rem;
  min-width: 200px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  display: ${(props) => (props.$isOpen ? "block" : "none")};
  z-index: 1001;

  /* Create invisible gap to prevent hover interruption */
  &::before {
    content: "";
    position: absolute;
    top: -0.5rem;
    left: 0;
    right: 0;
    height: 0.5rem;
    background: transparent;
  }
`;

const UserInfo = styled.div`
  padding: 0.5rem;
  border-bottom: 1px solid rgba(139, 92, 246, 0.2);
  margin-bottom: 0.5rem;
`;

const UserName = styled.div`
  color: #f8fafc;
  font-weight: 600;
  font-size: 0.875rem;
`;

const UserEmail = styled.div`
  color: #94a3b8;
  font-size: 0.75rem;
  margin-top: 0.25rem;
`;

const DropdownItem = styled(Link)`
  display: block;
  padding: 0.75rem;
  color: #e2e8f0;
  text-decoration: none;
  border-radius: 6px;
  font-size: 0.875rem;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(139, 92, 246, 0.1);
    color: #f8fafc;
  }
`;

const DropdownButton = styled.button`
  display: block;
  width: 100%;
  padding: 0.75rem;
  background: transparent;
  border: none;
  color: #ef4444;
  text-align: left;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(239, 68, 68, 0.1);
  }
`;

const DropdownDivider = styled.div`
  height: 1px;
  background: rgba(139, 92, 246, 0.2);
  margin: 0.5rem 0;
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: #cbd5e1;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;

  @media (max-width: 768px) {
    display: flex;
  }

  &:hover {
    color: #0ea5e9;
  }
`;

const MobileMenu = styled.div<{ $isOpen: boolean }>`
  display: ${(props) => (props.$isOpen ? "flex" : "none")};
  flex-direction: column;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: rgba(15, 23, 42, 0.98);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid #334155;
  padding: 1rem;
  z-index: 1000;

  @media (min-width: 769px) {
    display: none;
  }
`;

const MobileNavLink = styled(Link)<{ $isActive?: boolean }>`
  color: ${(props) => (props.$isActive ? "#0ea5e9" : "#cbd5e1")};
  text-decoration: none;
  font-weight: 500;
  padding: 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(30, 41, 59, 0.5);
    color: #0ea5e9;
  }

  ${(props) =>
    props.$isActive &&
    `
    background: rgba(30, 41, 59, 0.5);
    color: #0ea5e9;
  `}
`;

const AuthSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileAuthSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  border-top: 1px solid #334155;
  margin-top: 0.5rem;
`;

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { data: session } = useSession();
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Bars", href: "/bars" },
    { name: "Plan a Crawl", href: "/crawl-planner" },
    // Only show "My Crawls" when user is authenticated
    ...(session ? [{ name: "My Crawls", href: "/my-crawls" }] : []),
    { name: "Discover Crawls", href: "/crawls-dashboard" },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  const handleLogout = () => {
    signOut();
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const isAuthenticated = !!session;

  return (
    <Nav>
      <NavContainer>
        {/* Logo */}
        <Logo href="/">
          <LogoIcon>🍻</LogoIcon>
          Hoppr
        </Logo>

        {/* Desktop Navigation */}
        <NavLinks>
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              href={item.href}
              $isActive={isActive(item.href)}
            >
              {item.name}
            </NavLink>
          ))}
        </NavLinks>

        {/* Desktop Auth Section */}
        <AuthSection>
          {isAuthenticated ? (
            <UserMenu ref={userMenuRef} onClick={toggleUserMenu}>
              <UserAvatar>
                {session.user?.name?.charAt(0).toUpperCase() || "U"}
              </UserAvatar>
              <UserDropdown $isOpen={isUserMenuOpen}>
                <UserInfo>
                  <UserName>{session.user?.name || "User"}</UserName>
                  <UserEmail>{session.user?.email}</UserEmail>
                </UserInfo>
                <DropdownItem
                  href="/my-crawls"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  My Crawls
                </DropdownItem>
                <DropdownItem
                  href="/profile"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  Profile
                </DropdownItem>
                <DropdownDivider />
                <DropdownButton onClick={handleLogout}>Log out</DropdownButton>
              </UserDropdown>
            </UserMenu>
          ) : (
            <>
              <SecondaryGradientButton href="/auth/login">
                Log in
              </SecondaryGradientButton>
              <GradientButton href="/auth/signup">Sign up</GradientButton>
            </>
          )}
        </AuthSection>

        {/* Mobile Menu Button */}
        <MobileMenuButton
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          ☰
        </MobileMenuButton>
      </NavContainer>

      {/* Mobile Menu */}
      <MobileMenu $isOpen={isMobileMenuOpen}>
        {navigation.map((item) => (
          <MobileNavLink
            key={item.name}
            href={item.href}
            $isActive={isActive(item.href)}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {item.name}
          </MobileNavLink>
        ))}

        <MobileAuthSection>
          {isAuthenticated ? (
            <>
              <div
                style={{
                  padding: "0.5rem",
                  color: "#e2e8f0",
                  fontSize: "0.875rem",
                }}
              >
                Signed in as <strong>{session.user?.name}</strong>
              </div>
              <DropdownButton
                onClick={handleLogout}
                style={{ marginTop: "0.5rem" }}
              >
                Log out
              </DropdownButton>
            </>
          ) : (
            <>
              <SecondaryGradientButton
                href="/auth/login"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Log in
              </SecondaryGradientButton>
              <GradientButton
                href="/auth/signup"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign up
              </GradientButton>
            </>
          )}
        </MobileAuthSection>
      </MobileMenu>
    </Nav>
  );
}
