require("dotenv").config();
const { default: axios } = require("axios");
const express = require("express");
const cors = require("cors");
const base64 = require("image-to-base64");

const app = express();
const PORT = process.env.PORT || 5000;

// use cors
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World");
});

// utils
const imgUrlToBase64 = async (url) => {
  const res = await base64(url);
  return `data:image/jpeg;base64,${res}`;
};

app.get("/p/:postID", async (req, res) => {
  try {
    const { postID } = req.params;
    const url = `https://www.instagram.com/p/${postID}/?__a=1&__d=dis`;
    const { data } = await axios({
      url,
      headers: {
        cookie: process.env.COOKIE,
      },
    });

    const jsonData = async () => ({
      id: data?.items[0]?.id,
      caption: data?.items[0]?.caption?.text,
      shortcode: data?.items[0]?.code,
      likes:
        data?.items[0]?.edge_media_preview_like?.count ||
        data?.items[0]?.like_count,
      comments:
        data?.items[0]?.edge_media_to_parent_comment?.count ||
        data?.items[0]?.comment_count,
      isVideo: data?.items[0]?.video_versions ? true : false,
      timestamp: data?.items[0]?.taken_at,
      duration: data?.items[0]?.video_duration,
      hasAudio: data?.items[0]?.has_audio,
      views: data?.items[0]?.view_count,
      plays: data?.items[0]?.play_count,
      thumbnail: data?.items[0]?.carousel_media
        ? await imgUrlToBase64(
            data?.items[0]?.carousel_media[0]?.image_versions2?.candidates[0]
              ?.url
          )
        : await imgUrlToBase64(
            data?.items[0]?.image_versions2?.candidates[0]?.url
          ),
      isCarousel: data?.items[0]?.carousel_media ? true : false,
      carouselCount: data?.items[0]?.carousel_media_count,
      singleMedia: data?.items[0]?.carousel_media
        ? null
        : {
            thumbnail: await imgUrlToBase64(
              data?.items[0]?.image_versions2?.candidates[0]?.url
            ),
            isVideo: data?.items[0]?.video_versions ? true : false,
            duration: data?.items[0]?.video_duration,
            hasAudio: data?.items[0]?.has_audio,
            resources: data?.items[0]?.image_versions2?.candidates?.map(
              (item) => ({
                src: item.url,
                width: item.width,
                height: item.height,
              })
            ),
            videoResources: data?.items[0]?.video_versions
              ? data?.items[0]?.video_versions?.map((item) => ({
                  src: item.url,
                  width: item.width,
                  height: item.height,
                }))
              : null,
          },
      carouselMedia: data?.items[0]?.carousel_media
        ? await Promise.all(
            data?.items[0]?.carousel_media?.map(async (item) => ({
              id: item?.id,
              thumbnail: await imgUrlToBase64(
                item?.image_versions2?.candidates[0]?.url
              ),
              isVideo: item?.video_versions ? true : false,
              duration: item?.video_versions ? item?.video_duration : null,
              resources: item?.image_versions2?.candidates?.map((item) => ({
                src: item.url,
                width: item.width,
                height: item.height,
              })),
              videoResources: item?.video_versions
                ? item?.video_versions?.map((item) => ({
                    src: item.url,
                    width: item.width,
                    height: item.height,
                  }))
                : null,
            }))
          )
        : null,
      user: {
        id: data?.items[0]?.user?.id,
        username: data?.items[0]?.user?.username,
        fullName: data?.items[0]?.user?.full_name,
        isVerified: data?.items[0]?.user?.is_verified,
        isPrivate: data?.items[0]?.user?.is_private,
        profilePic: await imgUrlToBase64(data?.items[0]?.user?.profile_pic_url),
      },
    });
    res.send(await jsonData());
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      error: true,
      message: error.message,
    });
  } finally {
    console.log("done");
  }
});

console.clear();

app.listen(PORT, () => {
  console.log(`Server is running on the ${PORT}`);
});
