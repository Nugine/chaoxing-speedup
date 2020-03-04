// ==UserScript==
// @name         chaoxing-speedup
// @version      0.1.0
// @description  a console helper for chaoxing
// @author       Nugine
// @date         2020-03-04
// @match        *.chaoxing.com/*
// @grant        none
// @run-at       document-idle
// @noframes
// ==/UserScript==

(function () {
    'use strict';

    class Cxsu {
        constructor() {
            this.videos = [];
        }

        allowPaste() {
            function _allowPaste(w) {
                for (let i = 0; i < w.frames.length; ++i) {
                    _allowPaste(w.frames[i]);
                }

                if (!w.UE) {
                    return;
                }
                const elements = w.document.getElementsByTagName('textarea');
                if (elements.length == 0) {
                    return;
                }
                const id = elements[0].id;
                w.UE.getEditor(id).removeListener('beforepaste', myEditor_paste);
                console.log(`allow paste: id = ${id}`);
            }
            _allowPaste(window)
        }

        findVideos() {
            function* _findVideos(w) {
                if (w.videojs) {
                    yield w.videojs.players.video;
                }
                for (let i = 0; i < w.frames.length; ++i) {
                    for (const v of _findVideos(w.frames[i])) {
                        yield v;
                    }
                }
            }

            this.videos.splice(0, this.videos.length);
            for (const video of _findVideos(window)) {
                this.videos.push(video);
            }

            console.log(`found ${this.videos.length} videos`);
            return this.videos;
        }

        install() {
            this.allowPaste();
            this.findVideos();
        }

        setPlaybackRate(r) {
            for (const video of this.videos) {
                video.playbackRate(r);
            }
        }

        play(idx = 0, rate = undefined) {
            const video = this.vjs[idx].players.video;
            if (rate !== undefined) {
                video.playbackRate(rate);
            }
            return video.play()
        }
    }

    window.cxsu = new Cxsu();

    setTimeout(() => {
        window.cxsu.install();
        console.log("chaoxing-speedup enabled");
    }, 3000)

})();
