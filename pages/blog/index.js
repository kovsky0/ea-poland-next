import { gql } from "@apollo/client";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Image from "next/image";
import { useState } from "react";
import Slider from "react-slick";
import client from "../../apollo-client";
import Button from "../../components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faChevronLeft,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function Blog({ blogData }) {
  const [query, setQuery] = useState("");
  const { t } = useTranslation("common");

  const settings = {
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    cssEase: "linear",
    pauseOnHover: true,
    className: "flex items-center",
    dots: true,
    arrows: false,
  };
  return (
    <div className="mt-20">
      <Slider {...settings}>
        {blogData.recommendedPosts.nodes.map((post) => (
          <div
            className="flex flex-col justify-center items-start"
            key={post.slug}
          >
            <div
              className="flex flex-col justify-center gap-4 items-start px-8 lg:px-[6.25rem] h-[30rem] lg:h-[36.25rem]"
              style={{
                backgroundImage: `linear-gradient(
                        180deg,
                        rgba(0, 0, 0, 0.5452556022408963),
                        rgba(0, 0, 0, 0.5452556022408963)
                      ), url(https://ea-poland-wordpress.azurewebsites.net${post.featuredImage.node.sourceUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                width: "100%",
                color: "#f5f5f5",
              }}
            >
              <span className="flex items-center gap-4">
                <Image
                  className="w-10 rounded-full"
                  src={`https://ea-poland-wordpress.azurewebsites.net${
                    post.author.node.customuser.photo &&
                    post.author.node.customuser.photo.sourceUrl
                  }`}
                  alt={post.author.node.slug}
                  width={40}
                  height={40}
                />
                <p className="font-sans uppercase text-sm font-bold">
                  {post.author.node.name} /{" "}
                  {post.categories.edges
                    .filter((c) => c.isPrimary)
                    .map((cat) => cat.node.name)}
                </p>
              </span>
              <h1 className="font-alt text-3xl text-white">{post.title}</h1>
              <div
                dangerouslySetInnerHTML={{
                  __html: post.excerpt,
                }}
                className=""
              />
              <Button text="Czytaj dalej" href={`/blog/${post.slug}`} />
            </div>
          </div>
        ))}
      </Slider>
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:px-16">
        <div className="lg:col-start-3 p-4">
          <form className="flex">
            <input
              className="bg-white border-b-2 border-gray-400 pl-3 text-xs font-sans flex-1"
              id="search"
              type="text"
              aria-label="search query"
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              className="bg-primary font-sans uppercase font-bold text-xs text-white shadow px-6 py-3"
              type="submit"
              // onClick={subscribe} route to the search result page with query as a param
            >
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </form>
        </div>
        <div className="lg:col-start-3 flex flex-col gap-2 p-4">
          <h3 className="uppercase font-bold text-lg">ZAGADNIENIA</h3>
          {blogData.categories.nodes.map((category) => (
            <Link href={`/blog/category/${category.slug}`} key={category.slug}>
              <a>
                <button
                  className="w-full bg-mono p-4 uppercase font-bold"
                  type="submit"
                >
                  <div className="flex justify-between items-center">
                    <h5>{category.name}</h5>
                    <FontAwesomeIcon icon={faChevronRight} />
                  </div>{" "}
                </button>
              </a>
            </Link>
          ))}
        </div>
        <div className="lg:col-start-1 lg:col-span-2 lg:row-start-1 lg:row-end-3 p-4 lg:p-8 flex items-center justify-center">
          {blogData.posts.nodes[0] && (
            <Link href={`/blog/${blogData.posts.nodes[0].slug}`}>
              <a className="w-full">
                <div
                  style={{
                    backgroundImage: `linear-gradient(
                        0deg,
                        rgba(0, 0, 0, 0.5452556022408963),
                        rgba(0, 0, 0, 0.5452556022408963)
                      ), url(https://ea-poland-wordpress.azurewebsites.net${blogData.posts.nodes[0].featuredImage.node.sourceUrl})`,
                  }}
                  className="flex flex-col justify-end w-full h-[20rem] lg:h-[30rem] gap-4 rounded-lg px-8 py-16 md:px-16 md:py-24 text-white"
                  key={blogData.posts.nodes[0].id}
                >
                  <h3 className="font-sans uppercase font-bold">
                    {blogData.posts.nodes[0].categories.edges
                      .filter((c) => c.isPrimary)
                      .map((cat) => cat.node.name)}
                  </h3>
                  <h1 className="text-lg md:text-2xl font-alt">
                    {blogData.posts.nodes[0].title}
                  </h1>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: blogData.posts.nodes[0].excerpt,
                    }}
                    className="text-sm md:text-base text-ellipsis"
                  />
                </div>
              </a>
            </Link>
          )}
        </div>
        <div className="lg:col-span-3 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 px-4">
          {blogData.posts.nodes.slice(1).map((post) => (
            <Link href={`/blog/${post.slug}`} key={post.slug}>
              <a className="w-full">
                <div
                  style={{
                    backgroundImage: `linear-gradient(
                        0deg,
                        rgba(0, 0, 0, 0.5452556022408963),
                        rgba(0, 0, 0, 0.5452556022408963)
                      ), url(https://ea-poland-wordpress.azurewebsites.net${post.featuredImage.node.sourceUrl})`,
                  }}
                  className="flex flex-col justify-end w-full h-[20rem] lg:h-[30rem] gap-4 rounded-lg px-8 py-16 md:px-16 md:py-24 xl:p-8 text-white"
                  key={post.id}
                >
                  <h3 className="font-sans uppercase font-bold">
                    {post.categories.edges
                      .filter((c) => c.isPrimary)
                      .map((cat) => cat.node.name)}
                  </h3>
                  <h1 className="text-lg md:text-2xl font-alt">{post.title}</h1>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: post.excerpt,
                    }}
                    className="text-sm md:text-base text-ellipsis"
                  />
                </div>
              </a>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export async function getStaticProps({ locale }) {
  const { data } = await client.query({
    query: gql`
      query GET_DATA {
        categories(where: { parent: null }) {
          nodes {
            id
            slug
            name
          }
        }
        recommendedPosts: posts(where: { tag: "polecane" }) {
          nodes {
            author {
              node {
                customuser {
                  photo {
                    sourceUrl
                  }
                }
                slug
                name
              }
            }
            featuredImage {
              node {
                sourceUrl
              }
            }
            excerpt(format: RENDERED)
            slug
            title(format: RENDERED)
            id
            categories {
              edges {
                node {
                  id
                  name
                }
                isPrimary
              }
            }
          }
        }
        posts(first: 7) {
          nodes {
            author {
              node {
                customuser {
                  photo {
                    sourceUrl
                  }
                }
                slug
                name
              }
            }
            featuredImage {
              node {
                sourceUrl
                slug
              }
            }
            excerpt(format: RENDERED)
            slug
            title(format: RENDERED)
            id
            categories {
              edges {
                node {
                  id
                  name
                }
                isPrimary
              }
            }
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
            endCursor
            startCursor
          }
        }
      }
    `,
  });

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      blogData: data,
    },
  };
}
