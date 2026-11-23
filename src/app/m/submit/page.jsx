import AllowUserOnly from "@/lib/protection/AllowUserOnly";
import Submit from "./Submit";

export const metadata = {
   title: 'Authorship application | KKI Smart Connects',
}

const page = () => {
    return (
        <AllowUserOnly>
            <Submit></Submit>
        </AllowUserOnly>
    )
}

export default page;