import { getPublishedPosts } from "@/lib/api/blog";

export const revalidate = 60;

export default async function Page() {
    const { data: posts, error } = await getPublishedPosts();
    if (error) {
        console.log(error);
        return <div>Error: {error.message}</div>;
    }

    return (
        <div>
            {posts.data.map((post) => (
                <div key={post.id}>
                    <h2>{post.title}</h2>
                </div>
            ))}
        </div>
    );
}