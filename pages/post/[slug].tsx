import { GetStaticProps } from 'next';
import PortableText from 'react-portable-text';
import Header from '../../components/Header';
import { sanityClient, urlFor } from '../../sanity';
import { Post } from '../../typings';
import { useForm, SubmitHandler } from 'react-hook-form';

import dynamic from 'next/dynamic';

interface Props {
  post: Post;
}

interface IFormInput {
  _id: string;
  name: string;
  email: string;
  comment: string;
}

function Post({ post }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    await fetch('/api/createComment', {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (res.status === 200) {
          alert('Comment submitted');
        } else {
          alert('Error submitting comment');
        }
      })
      .catch((err) => {
        alert('Error submitting comment');
      });
  };

  return (
    <main>
      <Header />
      <img
        className="object-cover w-full h-60"
        src={urlFor(post.mainImage).url()}
        alt={post.title}
      />
      <article className="max-w-3xl p-5 mx-auto">
        <h1 className="mt-10 mb-3 text-3xl">{post.title}</h1>
        <h2 className="mb-2 font-light text-gray-500 tex-xl">
          {post.description}
        </h2>
        <div className="flex items-center space-x-2">
          <img
            className="w-10 h-10 rounded-full"
            src={urlFor(post.author.image).url()!}
            alt={post.author.name}
          />
          <p className="text-sm font-extralight">
            Blog post by{' '}
            <span className="text-green-600">{post.author.name}</span> on{' '}
            {new Date(post._createdAt).toLocaleString()}
          </p>
        </div>
        <div className="mt-10">
          <PortableText
            className=""
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
            content={post.body}
            serializers={{
              h1: (props: any) => (
                <h1
                  className="my-5 text-2xl font-bold"
                  {...props}
                />
              ),
              h2: (props: any) => (
                <h2
                  className="my-5 text-xl font-bold"
                  {...props}
                />
              ),
              li: ({ children }: any) => (
                <li className="ml-4 list-disc"> {children}</li>
              ),
              link: ({ href, children }: any) => (
                <a
                  className="text-blue-500 hover:underline"
                  href={href}
                >
                  {children}
                </a>
              ),
            }}
          />
        </div>
      </article>
      <hr className="max-w-lg mx-auto my-5 border border-yellow-500" />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col max-w-2xl p-5 mx-auto mb-10"
      >
        <h3 className="text-sm text-yellow-500">Enjoyed this article?</h3>
        <h4 className="text-3xl font-bold">Leave a comment below.</h4>
        <hr className="py-3 mt-2" />

        <input
          {...register('_id')}
          type="hidden"
          name="_id"
          value={post._id}
        />

        <label
          htmlFor="name"
          className="block mb-5"
        >
          <span className="text-gray-700">Name</span>
          <input
            {...register('name', { required: 'Name is required' })}
            type="text"
            name="name"
            id="name"
            placeholder="Name"
            className="block w-full px-3 py-2 mt-1 border rounded shadow form-input ring-yellow-500"
          />
        </label>
        <label
          htmlFor="email"
          className="block mb-5"
        >
          <span className="text-gray-700">Email</span>
          <input
            {...register('email', { required: 'Email is required' })}
            type="email"
            name="email"
            id="email"
            placeholder="E-mail"
            className="block w-full px-3 py-2 mt-1 border rounded shadow form-input ring-yellow-500"
          />
        </label>
        <label
          htmlFor="comment"
          className="block mb-5"
        >
          <span className="text-gray-700">Comment</span>
          <textarea
            {...register('comment', { required: 'Comment is required' })}
            name="comment"
            id="comment"
            placeholder="Your comment"
            rows={8}
            className="block w-full px-3 py-2 mt-1 border rounded shadow form-textarea ring-yellow-500"
          />
        </label>
        <div>
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}
          {errors.comment && (
            <p className="text-red-500">{errors.comment.message}</p>
          )}
        </div>

        <input
          type="submit"
          value="Submit"
          className="px-4 py-2 font-bold text-white bg-yellow-500 rounded shadow hover:bg-yellow-400 focus:shadow-outline focus:outline-none"
        />
      </form>
      <div className="flex flex-col max-w-2xl p-10 mx-auto my-10 space-y-2 shadow shadow-yellow-500">
        <h3 className="text-4xl">Comments</h3>
        <hr className="pb-2" />

        {post.comments.map((comment) => (
          <div key={comment._id}>
            <p className="">
              <span className="text-yellow-500">{comment.userName}:</span>{' '}
              {comment.comment}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}

export default dynamic(() => Promise.resolve(Post), { ssr: false });

export const getStaticPaths = async () => {
  const query = `
    *[_type == "post"]{
        _id,
        slug {
          current
        }
      }
    `;

  const posts = await sanityClient.fetch(query);

  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current,
    },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `
        *[_type == "post" && slug.current == $slug][0]{
          _id,
          _createdAt,
          title,
          author->{
              name,
              image
          },
          'comments': *[
            _type == "comment" &&
            post._ref == ^._id &&
            approved == true
          ],
          description,
          mainImage,
          slug,
          body
        }
    `;

  const post = await sanityClient.fetch(query, { slug: params?.slug });

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post,
    },
    revalidate: 60,
  };
};
