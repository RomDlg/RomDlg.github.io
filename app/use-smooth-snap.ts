"use client";

import { useEffect } from "react";

/* =========================================================
   Défilement affiche par affiche, piloté en JS.

   Le snap natif (`scroll-snap-type:y mandatory`) fait le bon geste mais
   à une durée imposée par le navigateur — sec, non réglable. Ici on
   anime nous-mêmes le scroll : durée et courbe maîtrisées.

   Ne s'active que sur pointeur fin (souris / trackpad). Sur tactile, le
   snap CSS suit le doigt : le hijacker rendrait l'inertie iOS erratique.
   ========================================================= */

/* Les deux réglages à toucher pour changer la sensation. */
const DURATION = 1100; // ms d'une affiche à la suivante
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const WHEEL_MIN = 12; // en dessous : micro-cran de trackpad, on ignore
const COOLDOWN = 180; // ms après l'animation, le temps que l'inertie retombe
const SWIPE_MIN = 6; // px de marge avant de considérer un bord atteint

export function useSmoothSnap(selector = ".poster") {
  useEffect(() => {
    const root = document.documentElement;
    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mqCoarse = window.matchMedia("(pointer: coarse)");

    let sections: HTMLElement[] = [];
    let index = 0;
    let raf = 0;
    let animating = false;
    let settledAt = 0;
    let on = false;

    /* Mêmes conditions que la couche snap du CSS : trop court en hauteur,
       les affiches débordent et le pas-à-pas n'a plus de sens. */
    const usable = () =>
      !mqReduce.matches && !mqCoarse.matches && window.innerHeight >= 560;

    const measure = () => {
      sections = Array.from(document.querySelectorAll<HTMLElement>(selector));
    };

    const nearest = () => {
      const y = window.scrollY;
      let best = 0;
      let bestDist = Infinity;
      sections.forEach((s, i) => {
        const d = Math.abs(s.offsetTop - y);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      return best;
    };

    const stop = () => {
      cancelAnimationFrame(raf);
      animating = false;
    };

    const goTo = (i: number) => {
      if (!sections.length) return;
      const clamped = Math.max(0, Math.min(sections.length - 1, i));
      const maxTop = document.documentElement.scrollHeight - window.innerHeight;
      const to = Math.min(sections[clamped].offsetTop, Math.max(0, maxTop));
      const from = window.scrollY;
      index = clamped;
      if (Math.abs(to - from) < 2) return;

      stop();
      animating = true;
      const start = performance.now();
      const frame = (now: number) => {
        const t = Math.min(1, (now - start) / DURATION);
        /* `html.js-scroll` force `scroll-behavior:auto` : chaque pas est
           appliqué tel quel, sans que le navigateur le lisse à son tour. */
        window.scrollTo(0, from + (to - from) * easeInOutCubic(t));
        if (t < 1) {
          raf = requestAnimationFrame(frame);
        } else {
          animating = false;
          settledAt = performance.now();
        }
      };
      raf = requestAnimationFrame(frame);
    };

    const busy = () => animating || performance.now() - settledAt < COOLDOWN;

    /* Une affiche plus haute que l'écran doit pouvoir se lire au fil du
       défilement natif : on ne reprend la main qu'à ses bords. */
    const atEdge = (dir: number) => {
      const cur = sections[index];
      if (!cur) return true;
      const overflow = cur.offsetHeight - window.innerHeight;
      if (overflow <= SWIPE_MIN) return true;
      const within = window.scrollY - cur.offsetTop;
      return dir > 0 ? within >= overflow - SWIPE_MIN : within <= SWIPE_MIN;
    };

    const onWheel = (e: WheelEvent) => {
      if (!on || e.ctrlKey) return; // ctrl+molette = zoom, on ne touche pas
      const dir = e.deltaY > 0 ? 1 : -1;
      if (!atEdge(dir)) return;
      e.preventDefault();
      if (busy() || Math.abs(e.deltaY) < WHEEL_MIN) return;
      goTo(index + dir);
    };

    const onKey = (e: KeyboardEvent) => {
      if (!on || e.metaKey || e.ctrlKey || e.altKey) return;
      const el = e.target as HTMLElement | null;
      if (el?.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el?.tagName ?? ""))
        return;

      let next: number | null = null;
      if (e.key === "ArrowDown" || e.key === "PageDown") next = index + 1;
      else if (e.key === "ArrowUp" || e.key === "PageUp") next = index - 1;
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = sections.length - 1;
      if (next === null) return;

      e.preventDefault();
      if (busy()) return;
      goTo(next);
    };

    /* La nav à pastilles est faite d'ancres : sans interception, le saut
       repasserait par le smooth natif — donc par sa durée à lui. */
    const onClick = (e: MouseEvent) => {
      if (!on || e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as HTMLElement | null)?.closest?.("a[href^='#']");
      const hash = link?.getAttribute("href");
      if (!hash || hash === "#") return;
      const target = document.querySelector(hash);
      const i = sections.indexOf(target as HTMLElement);
      if (i < 0) return;
      e.preventDefault();
      history.replaceState(null, "", hash);
      goTo(i);
    };

    /* Molette libre, barre de défilement, Ctrl+F… : on resynchronise
       l'index pour que le prochain cran reparte du bon endroit. */
    let idle = 0;
    const onScroll = () => {
      if (animating) return;
      clearTimeout(idle);
      idle = window.setTimeout(() => {
        if (!animating) index = nearest();
      }, 120);
    };

    const onResize = () => {
      measure();
      if (!animating) index = nearest();
    };

    const enable = () => {
      if (on) return;
      on = true;
      root.classList.add("js-scroll");
      window.addEventListener("wheel", onWheel, { passive: false });
      window.addEventListener("keydown", onKey);
      document.addEventListener("click", onClick);
    };

    const disable = () => {
      if (!on) return;
      on = false;
      stop();
      root.classList.remove("js-scroll");
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };

    const sync = () => {
      measure();
      index = nearest();
      if (usable()) enable();
      else disable();
    };

    sync();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    mqReduce.addEventListener("change", sync);
    mqCoarse.addEventListener("change", sync);

    return () => {
      disable();
      clearTimeout(idle);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      mqReduce.removeEventListener("change", sync);
      mqCoarse.removeEventListener("change", sync);
    };
  }, [selector]);
}