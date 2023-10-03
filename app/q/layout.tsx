export default function Layout(props: {
    children: React.ReactNode,
    event: React.ReactNode
    // analytics: React.ReactNode
    // team: React.ReactNode
}) {
    return (
        <>
            {props.children}
        </>
    )
}