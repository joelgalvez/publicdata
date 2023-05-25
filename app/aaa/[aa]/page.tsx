export default async function Page({ params }) {

    return (
        <div>
            <pre>
                You are {params.aa}
            </pre>
        </div>
    );
}