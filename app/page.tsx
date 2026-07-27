"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { useSmoothSnap } from "./use-smooth-snap";

const POSTERS = [
  { id: "p1", label: "Accueil" },
  { id: "p2", label: "Écurie" },
  { id: "p3", label: "Scaffolder" },
  { id: "p4", label: "SmartNotch" },
  { id: "p5", label: "Manifeste" },
  { id: "p6", label: "Profil" },
  { id: "p7", label: "Missions" },
  { id: "p8", label: "Contact" },
];

export default function Home() {
  const dotsRef = useRef<HTMLElement>(null);

  /* Passage d'affiche à affiche : durée et courbe pilotées en JS plutôt
     que laissées au snap natif (voir use-smooth-snap.ts). */
  useSmoothSnap(".poster");

  useEffect(() => {
    const posters = document.querySelectorAll<HTMLElement>(".poster");
    const dots = dotsRef.current?.querySelectorAll("a") ?? [];
    const dotsNav = dotsRef.current;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("live");
          const idx = Array.prototype.indexOf.call(posters, e.target);
          dots.forEach((d, i) => d.classList.toggle("on", i === idx));
          /* dots lisibles sur fond clair/fluo : bascule en noir */
          dotsNav?.classList.toggle(
            "dark",
            e.target.classList.contains("p-blanc") ||
              e.target.classList.contains("p-fluo")
          );
        });
      },
      { threshold: 0.5 }
    );
    posters.forEach((p) => io.observe(p));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <nav className="dots" aria-label="Navigation posters" ref={dotsRef}>
        {POSTERS.map((p) => (
          <a key={p.id} href={`#${p.id}`} aria-label={p.label}></a>
        ))}
      </nav>

      {/* Les `.corner` et `.ghost` restent hors de `.sheet` : ce sont les repères
          du bord de feuille, ils suivent le viewport. `.sheet` porte la
          composition, bornée en largeur pour rester lisible sur grand écran. */}
      <main>
        {/* ============ 01 · HERO ============ */}
        <section className="poster p-noir" id="p1" data-screen-label="Hero">
          <span className="corner tl">Romain Delage — Portfolio 2026</span>
          <span className="corner tr">Développeur indépendant</span>
          <span className="corner bl">Web · Mobile · macOS</span>
          <span className="corner br">Défiler ↓</span>
          <div className="sheet">
            <h1
              className="hero-name"
              aria-label="Votre idée, en ligne — Romain Delage, développeur"
            >
              <span className="solid rise">Votre</span>
              <span className="out rise d1">idée,</span>
              <span className="fluo rise d2">en ligne.</span>
            </h1>
            <div className="hero-strip rise d3">
              <p>
                Moi c&apos;est Romain, développeur indépendant. Je conçois et je
                code des apps mobiles, des SaaS et des logiciels macOS — puis je
                les mets en ligne moi-même, serveur compris.
              </p>
              <div className="stats">
                <span>
                  <b>4</b>&nbsp;ans à mon compte
                </span>
                <span>
                  <b>3</b>&nbsp;produits, 1 déjà en prod
                </span>
              </div>
            </div>
            <span className="avail-strip rise d4">
              <i></i>Disponible — parlons de votre projet
            </span>
          </div>
        </section>

        {/* ============ 02 · ÉCURIE ============ */}
        <section className="poster p-blanc proj" id="p2" data-screen-label="Écurie">
          <span className="ghost" aria-hidden="true">01</span>
          <span className="corner tl">Projet 01 / 03</span>
          <span className="corner tr">App mobile · mission client</span>
          <span className="corner bl">Flutter · Go · PostgreSQL · VPS</span>
          <span className="corner br">En production</span>
          <div className="sheet">
            <div className="proj-grid">
              <div>
                <span className="idx rise">Projet 01</span>
                <h2 className="rise d1">Écurie</h2>
                <div className="tagline rise d2">Vendre en direct. Sans Meta.</div>
                <span className="status rise d2"><i></i>En production</span>
                <div className="row rise d3">
                  <p>
                    Une écurie qui voulait <b>posséder sa plateforme</b> plutôt
                    que dépendre des petites annonces. App sur mesure — fiches
                    détaillées, contact qualifié, gestion des annonces —{" "}
                    <b>déployée de bout en bout</b> sur VPS&nbsp;: domaine,
                    serveur, sécurité, mises à jour.
                  </p>
                  <div className="chips">
                    <span>Flutter</span><span>Go</span><span>PostgreSQL</span><span>VPS</span>
                  </div>
                </div>
              </div>
              <div className="proj-media rise d2">
                <div className="mock-phone" aria-hidden="true">
                  <div className="screen">
                    <div className="notch"></div>
                    <div className="app-top">
                      <span className="t">Écurie</span>
                      <span className="av"></span>
                    </div>
                    <div className="listing">
                      <div className="lcard">
                        <div className="lph"></div>
                        <div className="meta">
                          <div className="h">Quartana du Pré</div>
                          <div className="s">Selle Français · 6 ans · Hongre</div>
                          <div className="price">14 500 €</div>
                        </div>
                      </div>
                      <div className="lcard">
                        <div className="lph"></div>
                        <div className="meta">
                          <div className="h">Poney Welsh B</div>
                          <div className="s">Poney · 4 ans · Jument</div>
                          <div className="price">6 200 €</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ 03 · SCAFFOLDER ============ */}
        <section className="poster p-noir proj" id="p3" data-screen-label="Scaffolder">
          <span className="ghost" aria-hidden="true">02</span>
          <span className="corner tl">Projet 02 / 03</span>
          <span className="corner tr">SaaS · produit personnel</span>
          <span className="corner bl">Next.js · Node · PostgreSQL · MCP</span>
          <span className="corner br">Bêta ouverte bientôt</span>
          <div className="sheet">
            <div className="proj-grid">
              <div>
                <span className="idx rise">Projet 02</span>
                <h2 className="rise d1">Scaffolder</h2>
                <div className="tagline rise d2">Le pilotage des fondateurs solo.</div>
                <span className="status rise d2"><i></i>Bêta ouverte bientôt</span>
                <div className="row rise d3">
                  <p>
                    Projets, tâches, coûts, revenus — concentré, pensé pour
                    avancer. Le différenciateur&nbsp;: un <b>serveur MCP natif</b>{" "}
                    — vos agents IA lisent et écrivent comme des collègues, sous
                    votre contrôle.
                  </p>
                  <div className="chips">
                    <span>Next.js</span><span>Node</span><span>PostgreSQL</span><span>MCP natif</span>
                  </div>
                </div>
              </div>
              <div className="proj-media rise d2">
                <div className="mock-win" aria-hidden="true">
                  <div className="bar2">
                    <span className="traffic"><i></i><i></i><i></i></span>
                    <span className="url">scaffolder.app / projets</span>
                  </div>
                  <div className="body2">
                    <div className="task done">
                      <span className="box"></span>
                      <div className="tx">
                        <div className="h">Landing page v2</div>
                        <div className="s">Terminé · 2 h</div>
                      </div>
                      <span className="who you">vous</span>
                    </div>
                    <div className="task">
                      <span className="box"></span>
                      <div className="tx">
                        <div className="h">Configurer Stripe</div>
                        <div className="s">En cours</div>
                      </div>
                      <span className="who ai">agent</span>
                    </div>
                    <div className="mcp">
                      <span className="pulse"></span>
                      <span className="mt">
                        <b>MCP</b> · l&apos;agent a créé 3 tâches et mis à jour les coûts
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ 04 · SMARTNOTCH ============ */}
        <section className="poster p-blanc proj" id="p4" data-screen-label="SmartNotch">
          <span className="ghost" aria-hidden="true">03</span>
          <span className="corner tl">Projet 03 / 03</span>
          <span className="corner tr">macOS natif · produit personnel</span>
          <span className="corner bl">Swift · SwiftTerm (fork) · Claude Code</span>
          <span className="corner br">Sortie imminente</span>
          <div className="sheet">
            <div className="proj-grid">
              <div>
                <span className="idx rise">Projet 03</span>
                <h2 className="rise d1">Smart<br />Notch</h2>
                <div className="tagline rise d2">Un terminal dans l&apos;encoche.</div>
                <span className="status rise d2"><i></i>Sortie imminente</span>
                <div className="row rise d3">
                  <p>
                    Poste de commande multi-agents pour Claude Code, logé dans{" "}
                    <b>l&apos;encoche du MacBook</b>&nbsp;: monitoring,
                    permissions, réponses — sans quitter l&apos;IDE. 100&nbsp;%
                    natif, basé sur un <b>fork personnalisé de SwiftTerm</b>.
                  </p>
                  <div className="chips">
                    <span>Swift</span><span>macOS natif</span><span>SwiftTerm (fork)</span><span>Claude Code</span>
                  </div>
                </div>
              </div>
              <div className="proj-media rise d2">
                <div className="mock-notch" aria-hidden="true">
                  <div className="macbar">
                    <div className="real-notch">
                      <span className="dotA"></span>
                      <span className="mini">2 agents</span>
                      <span className="dotB"></span>
                    </div>
                  </div>
                  <div className="term">
                    <div className="thead">
                      <span className="ttl">smartnotch · multi-agent</span>
                      <span className="ag">
                        <i style={{ background: "var(--fluo)" }}></i>
                        <i style={{ background: "#FFE81F" }}></i>
                        <i style={{ background: "rgba(244,242,237,.3)" }}></i>
                      </span>
                    </div>
                    <div className="agents">
                      <div className="agent">
                        <span className="st run"></span>
                        <span className="nm">agent · api</span>
                        <span className="ds">écrit handlers.go</span>
                      </div>
                      <div className="agent">
                        <span className="st wait"></span>
                        <span className="nm">agent · ui</span>
                        <span className="ds q">↳ demande permission</span>
                      </div>
                      <div className="agent">
                        <span className="st idle"></span>
                        <span className="nm">agent · tests</span>
                        <span className="ds">en attente</span>
                      </div>
                    </div>
                    <div className="tfoot">
                      <span className="pmt">❯</span> autoriser agent · ui{" "}
                      <span className="cur"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ 05 · MANIFESTE ============ */}
        <section className="poster p-fluo manif" id="p5" data-screen-label="Manifeste">
          <span className="corner tl">Manifeste</span>
          <span className="corner tr">05 / 08</span>
          <div className="sheet">
            <h2 className="rise">
              Je rends les idées concrètes —{" "}
              <span className="inv">de A à Z.</span>
            </h2>
            <p className="sub rise d1">
              Vous arrivez avec une idée. Je m&apos;occupe du reste&nbsp;: le
              design, le code, le serveur, la mise en ligne. À la fin, vous avez
              un produit qui tourne pour de vrai — et il est à vous.
            </p>
          </div>
          {/* pleine largeur : le bandeau file d'un bord de feuille à l'autre */}
          <div className="marq" id="marq" aria-hidden="true">
            <div className="track">
              <span className="u">
                De l&apos;idée à la production — Flutter — Go — Swift — Next.js — Rust —&nbsp;
              </span>
              <span className="u">
                De l&apos;idée à la production — Flutter — Go — Swift — Next.js — Rust —&nbsp;
              </span>
            </div>
          </div>
        </section>

        {/* ============ 06 · PROFIL + STACK ============ */}
        <section className="poster p-blanc profil" id="p6" data-screen-label="Profil">
          <span className="corner tl">Profil — 06 / 08</span>
          <span className="corner tr">4 ans d&apos;indépendance</span>
          <span className="corner br">Le bon outil pour le bon problème</span>
          <div className="sheet">
            <div className="profil-head rise">
              <h2>
                Des logiciels qu&apos;on ouvre chaque jour,{" "}
                <b>du site vitrine à l&apos;app native.</b>
              </h2>
              <Image
                className="portrait"
                src="/me-avatar.png"
                alt="Portrait de Romain Delage"
                width={220}
                height={220}
              />
            </div>
            <p className="lead2 rise d1">
              Ce qui me porte&nbsp;: créer des outils qui simplifient vraiment le
              quotidien — et les mener de l&apos;idée à la production. La
              technique sert le produit, jamais l&apos;inverse.
            </p>
            <div className="stack-table rise d2">
              <div className="stack-row">
                <span className="k">Front-end</span>
                <span className="v">
                  <span>React</span><span>Next.js</span><span>TypeScript</span><span>SEO technique</span>
                </span>
              </div>
              <div className="stack-row">
                <span className="k">Back-end &amp; API</span>
                <span className="v">
                  <span>Node</span><span>Python</span><span>Go</span><span>Rust</span><span>Firebase</span>
                </span>
              </div>
              <div className="stack-row">
                <span className="k">Mobile</span>
                <span className="v"><span>Swift</span><span>Flutter</span><span>React Native</span></span>
              </div>
              <div className="stack-row">
                <span className="k">Desktop</span>
                <span className="v"><span>Swift (macOS natif)</span><span>Tauri</span><span>Wails</span></span>
              </div>
              <div className="stack-row">
                <span className="k">Données</span>
                <span className="v">
                  <span>PostgreSQL</span><span>MySQL</span><span>MongoDB</span><span>ClickHouse</span><span>BigQuery</span><span>Elasticsearch</span>
                </span>
              </div>
              <div className="stack-row">
                <span className="k">Infra &amp; déploiement</span>
                <span className="v">
                  <span>VPS</span><span>Docker</span><span>Cloud Run</span><span>Cloud Storage</span><span>GitHub Actions</span><span>Cloudflare</span>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ============ 07 · MISSIONS ============ */}
        <section className="poster p-noir miss" id="p7" data-screen-label="Missions">
          <span className="corner tl">Missions freelance — 07 / 08</span>
          <span className="corner tr">Réponse sous 24 h</span>
          <span className="corner bl">Un seul interlocuteur</span>
          <div className="sheet">
            <h2 className="rise">
              Je prends aussi <b>des missions.</b>
            </h2>
            <div className="miss-grid rise d1">
              <div className="miss-step">
                <span className="n">01</span>
                <h3>Cadrage</h3>
                <p>Problème, périmètre, objectif. Un plan clair et un devis sans surprise.</p>
              </div>
              <div className="miss-step">
                <span className="n">02</span>
                <h3>Design</h3>
                <p>Maquettes et parcours, validés ensemble avant la première ligne de code.</p>
              </div>
              <div className="miss-step">
                <span className="n">03</span>
                <h3>Développement</h3>
                <p>Par itérations, avec des points réguliers. Pas une boîte noire.</p>
              </div>
              <div className="miss-step">
                <span className="n">04</span>
                <h3>Déploiement</h3>
                <p>Serveur, domaine, sécurité, sauvegardes. Un produit en ligne, pas un zip.</p>
              </div>
            </div>
            <div className="miss-promises rise d2">
              <span><b>Livraison</b> code, accès, doc — tout vous appartient.</span>
              <span><b>Infra</b> incluse, je m&apos;en occupe.</span>
            </div>
          </div>
        </section>

        {/* ============ 08 · CONTACT ============ */}
        <section className="poster p-fluo contactP" id="p8" data-screen-label="Contact">
          <span className="corner tl">Contact</span>
          <span className="corner tr">08 / 08 — réponse sous 24 h</span>
          <div className="sheet">
            <h2>
              <a href="mailto:contact@romaindelage.fr">
                <span className="rise" style={{ display: "block" }}>Écrivez-</span>
                <span className="out2 rise d1" style={{ display: "block" }}>moi.</span>
              </a>
            </h2>
            <div className="mail rise d2">
              <a href="mailto:contact@romaindelage.fr">contact@romaindelage.fr</a>
              <span className="note">{"// email à confirmer"}</span>
            </div>
            <div className="footer rise d3">
              <span>© 2026 Romain Delage</span>
              <span>Web · Mobile · macOS</span>
              <span>De l&apos;idée à la production</span>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
