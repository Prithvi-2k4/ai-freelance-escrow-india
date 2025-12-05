export default function Button({children, className='', ...props}) {
  return <button className={`px-4 py-2 rounded bg-brand-500 text-white ${className}`} {...props}>{children}</button>;
}
