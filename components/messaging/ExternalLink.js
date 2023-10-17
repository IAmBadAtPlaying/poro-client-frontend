export default function ExternalLink({link, text}) {

    const showWarning = (event) => {
        if (!confirm("You have clicked an external link. Are you sure you want to continue? You will be redirected to: \n" + link)) {
            event.preventDefault();
            return false;
        }
        return true;
    }

    return (
        <a href={link} onClick={showWarning} style={{color: "white"}}>
            {text}
        </a>
    )
}