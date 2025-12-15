export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user'));
  return <h1>Welcome {user?.name}</h1>;
}
