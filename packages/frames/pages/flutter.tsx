import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const FRAME_ID = "xyz.bridged.appbox.frames.flutter";
/**
 * state of flutter frame loading
 */
type FlutterLoadingState =
  | "pre-warming"
  | "compiling"
  | "js-compiled"
  | "engine-loaded"
  | "drawing"
  | "complete"
  | "failed";

interface FlutterFrameQuery {
  src: string;
  mode: "content" | "url";
  language: "js" | "dart";
}

export default function () {
  const router = useRouter();
  const query: FlutterFrameQuery = (router.query as any) as FlutterFrameQuery;
  const validQuery: boolean = query.src !== undefined;

  // emmit pre-warming on first time
  useEffect(() => {
    emmitState("pre-warming");
    if (validQuery) {
    }
  }, []);

  if (!validQuery) {
    return <FlutterFrameWrongUsageError />;
  }

  const onIframeLoaded = () => {
    emmitState("compiling");
  };

  return (
    <iframe
      id={FRAME_ID}
      src="flutter/frame-flutter.html"
      sandbox="allow-scripts allow-same-origin"
      onLoad={onIframeLoaded}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        width: "100%",
        height: "100%",
        border: "none",
        margin: 0,
        padding: 0,
        overflow: "hidden",
        zIndex: 999999,
      }}
    />
  );
}

function FlutterFrameWrongUsageError() {
  return (
    <div style={{ margin: 24 }}>
      <h6>ERROR</h6>
      <h5>Invalid Queries for flutter frame</h5>
      <div>
        <p>
          You have entered a wrong query for loading flutter preview. <br />
          <br />
          <strong>
            1. <code>src</code> is required.{" "}
          </strong>
          <br />
          src can be rather url or actual code content, written in js or dart.
          the both following data should be filled with below queries.
          <br />
          <br />
          <strong>
            2. <code>mode</code> is required.
          </strong>
          <br />
          to specify the mode of the src. it can be rather "source" or "url". if
          "source" is givven frame will use source as-is to load the flutter
          frame. if "url" is givven, frame will fetch the content from the "url"
          it can be gist url (raw).
          <br />
          <br />
          <strong>
            3. <code>language</code> is required.
          </strong>
          <br />
          to specify the code language of the source. it can be rather dart or
          compiled js. if dart is givven, frame will compile this to js and load
          the preview (you don't need to care about this part at all.).
          <br />
        </p>
      </div>
    </div>
  );
}

function emmitState(state: FlutterLoadingState) {
  window.postMessage(
    {
      state: state,
    },
    "*"
  );
}
