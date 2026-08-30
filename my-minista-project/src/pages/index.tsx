import "../assets/css/index.css"
import heroImg from "../assets/images/seagull.jpg"

export default function () {
  return (
    <section>
      <h2>Hello!</h2>
      <figure>
        <img src={heroImg} alt=""/>
      </figure>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
      <p>Nam viverra magna id ante euismod eleifend. Quisque non lacus magna. Ut ultricies cursus leo, sit amet rutrum dolor ultricies eget. Curabitur accumsan quis ante id porta. Sed sollicitudin vestibulum purus ut eleifend. </p>
      <div className="clear"></div>
    </section>
  )
}
