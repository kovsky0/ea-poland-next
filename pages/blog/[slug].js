import { gql } from "@apollo/client";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import client from "../../apollo-client";

export async function getStaticPaths({ locales }) {
  const { data } = await client.query({
    query: gql`
      query Posts {
        posts {
          nodes {
            slug
          }
        }
      }
    `,
  });

  const paths = [];

  data.posts.nodes.forEach((item) => {
    for (const locale of locales) {
      paths.push({
        params: {
          slug: item.slug,
        },
        locale,
      });
    }
  });

  return {
    paths,
    fallback: false,
  };
}

export default function Post({ postData }) {
  const prepareDate = (postDate) => {
    const date = new Date(postDate);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("pl-PL", options);
  };

  return (
    <div className="mt-20 flex flex-col items-center gap-16">
      {/* <Head>
        <title>{postData.attributes.title} - Hawelka.dev</title>
        {postData.attributes.SEO && (
          <>
            <meta
              name="description"
              content={postData.attributes.SEO.metaDescription}
            />
            <meta property="og:title" content={postData.attributes.title} />
            <meta property="og:type" content="article" />
            <meta
              property="og:image"
              content={postData.attributes.SEO.metaImage.data.attributes.url}
            />
            <meta
              property="twitter:image"
              content={
                postData.attributes.SEO.metaTwitterImage.data.attributes.url
              }
            />
            <meta property="twitter:card" content="summary_large_image" />
          </>
        )}
      </Hea>
      <ReactMarkdown className="prose prose-sm md:prose-lg lg:prose-xl xl:prose-2xl prose-slate w-11/12 mx-4 my-8">
        {postData.attributes.content}
      </ReactMarkdown> */}
      <div
        className="flex flex-col justify-center items-center w-full gap-6 h-[20rem] md:h-[30rem]"
        style={{
          backgroundImage: `linear-gradient(180deg, #00000080,#00000080), url(https://ea-poland-wordpress.azurewebsites.net${postData.featuredImage.node.sourceUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          width: "100%",
          color: "#f5f5f5",
        }}
      >
        <span className="flex items-center">
          <p className="uppercase font-bold text-sm lg:text-base">
            {postData.categories.edges
              .filter((c) => c.isPrimary)
              .map((cat) => cat.node.name)}
          </p>
        </span>
        <h1 className="text-center font-alt text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
          {postData.title}
        </h1>
        <p className="uppercase font-bold text-sm lg:text-base">
          {postData.author.node.name} / {prepareDate(postData.date)}
        </p>
      </div>
      <div
        className="p-4 sm:p-0 prose prose-md md:prose-lg lg:prose-xl xl:prose-2xl font-sans prose-p:text-justify prose-p:mb-8 prose-h3:font-alt prose-a:text-link prose-a:font-normal prose-a:no-underline prose-img:mx-auto"
        dangerouslySetInnerHTML={{ __html: postData ? postData.content : "" }}
      ></div>
    </div>
  );
}

export async function getStaticProps({ params, locale }) {
  const { data } = await client.query({
    query: gql`
        query GET_POST {
          post(id: "${params.slug}", idType: SLUG) {
            featuredImage {
              node {
                sourceUrl
                slug
              }
            }
            categories {
              edges {
                node {
                  id
                  name
                }
                isPrimary
              }
            }
            title(format: RENDERED)
            date
            author {
              node {
                name
                customuser {
                  photo {
                    sourceUrl
                    slug
                  }
                  email
                  linkedin
                }
                description
              }
            }
            content(format: RENDERED)
            tags {
              nodes {
                id
                name
                slug
              }
            }
            seo {
              title
              metaDesc
              fullHead
            }
          }
        }
      `,
  });

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      postData: data.post,
    },
  };
}
