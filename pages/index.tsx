import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import { sanityClient, urlFor } from '../sanity';
import { Post } from '../typings';

interface Props {
  posts: [Post];
}

export default function Home({ posts }: Props) {
  console.log('🚀 ~ posts', posts);

  return (
    <div className="mx-auto max-w-7xl">
      <Head>
        <title>Meduim Blog</title>
        <link
          rel="icon"
          href="/favicon.ico"
        />
      </Head>
      <Header />
      <div className="flex items-center justify-between py-10 bg-yellow-400 border-black border-y lg:py-0">
        <div className="px-10 space-y-5">
          <h1 className="max-w-xl font-serif text-6xl">
            <span className="underline decoration-black decoration-3">
              Medium
            </span>{' '}
            is a place to write, read, and connect
          </h1>
          <h2>
            It's easy and free to post your thinking on any topic and connect
            with millions of readers.
          </h2>
        </div>
        <img
          className="hidden h-32 md:inline-flex lg:h-full"
          src="https://accountabilitylab.org/wp-content/uploads/2020/03/Medium-logo.png"
          alt="M"
        />
      </div>

      <div className="grid grid-cols-1 gap-3 p-2 sm:grid-cols-2 lg:grid-cols-3 mg:gap-6 md:p-6 ">
        {posts.map((post) => (
          <Link
            key={post._id}
            href={`/post/${post.slug.current}`}
          >
            <div className="overflow-hidden border rounded-lg cursor-pointer group">
              <img
                className="object-cover w-full rounded-lg h-60 group-hover:scale-105"
                src={urlFor(post.mainImage).url()!}
                alt={post.title}
              />
              <div className="flex justify-between p-5 bg-white">
                <div className="flex justify-between w-full">
                  <div>
                    <p className="text-lg font-bold">{post.title}</p>
                    <p className="text-xs">
                      {post.description} by {post.author.name}
                    </p>
                  </div>
                  <img
                    className="w-12 h-12 rounded-full"
                    src={urlFor(post.author.image).url()!}
                    alt={post.author.name}
                  />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export const getServerSideProps = async () => {
  const query = `
  *[_type == "post"]{
    _id,
    title,
      author -> {
        name,
        image
      },
      description, mainImage,slug
  }
  `;

  const posts = sanityClient.fetch(query);

  return {
    props: {
      posts: await posts,
    },
  };
};
