import RedirectIfStored from "./components/RedirectIfStored"


export default function Page({ params, searchParams }) {

  return <div>
    <RedirectIfStored></RedirectIfStored>
  </div>
}