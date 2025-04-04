import Image from 'next/image'
import logo from '../public/images/logo.png'

const Logo = () => {
  return (
    <div style={{ width: '100%', maxWidth: '300px', margin: '0 auto' }}>
      <Image
        src={logo}
        alt="Logo"
        layout="responsive"
        objectFit="contain"
      />
    </div>
  )
}

export default Logo
