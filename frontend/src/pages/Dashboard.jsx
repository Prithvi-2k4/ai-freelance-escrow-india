export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user'));

  const logout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="container">
      <h1>Welcome {user?.email}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
