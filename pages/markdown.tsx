import Head from "next/head";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import remarkMath from "remark-math";
import markdown from "remark-parse";
import rehypeKatex from "rehype-katex";
import MainLayout from 'layout/MainLayout';

const data = `# Моделирование распространения электромагнитных волн на основе численного решения уравнений Максвелла

**Цель работы**:
 Освоить базовый численный метод решения уравнений Максвелла – FDTD-метод (метод конечных разностей во временной области) для моделирования процессов распространения электромагнитных волн в свободном пространстве и диэлектрических материалах.
#
# Теория
В 1860-1865 гг. один из величайших физиков XIX века _Джеймс Клерк Максвелл_ создал теорию **электромагнитного поля.** Согласно Максвеллу явление электромагнитной индукции объясняется следующим образом. Если в некоторой точке пространства изменяется во времени магнитное поле, то там образуется и электрическое поле. Если же в поле находится замкнутый проводник, то электрическое поле вызывает в нем индукционный ток. Из теории Максвелла следует, что возможен и обратный процесс. Если в некоторой области пространства меняется во времени электрическое поле, то здесь же образуется и магнитное поле. Таким образом, любое изменение со временем магнитного поля приводит к возникновению изменяющегося электрического поля, а всякое изменение со временем электрического поля порождает изменяющееся магнитное поле. Эти порождающие друг друга переменные электрические и магнитные поля образуют единое электромагнитное поле. Важнейшим результатом, который вытекает из сформулированной Максвеллом теории электромагнитного поля, стало предсказание возможности существования электромагнитных волн.

**Электромагнитная волна** – распространение электромагнитных полей в пространстве и во времени.

Электромагнитные волны, в отличие от упругих (звуковых) волн, могут распространяться в вакууме или любом другом веществе. Электромагнитные волны в вакууме распространяются со скоростью **c=299 792 км/с**, то есть со скоростью света.

## $$ c =\\frac{1}{\\sqrt{ε_0  μ_0}} $$

### $$ c $$ – скорость света, $$ c $$ = 299 792 км/с
### $$ μ_0 $$ – магнитная постоянная, $$ μ_0 $$ = 1.257 ⋅ 10-6 Гн/м
### $$ ε_0 $$ – электрическая постоянная, $$ ε_0 $$ = 0.885 ⋅ 10-11 Ф/м


В веществе скорость электромагнитной волны меньше, чем в вакууме. Соотношение между длиной волна, ее скоростью, периодом и частотой колебаний, полученные для механических волн, выполняются и для электромагнитных волн:
## $$ c =\\frac{λ}{T} $$
## $$ c = λ$$𝜈
#### $$ λ $$ – длина волны, $$ [λ] $$ = 1м
#### $$ T $$ – период электромагнитных колебаний, $$ [T] $$ = 1с

### 𝜈 – частота электромагнитных колебаний, [𝜈] = 1Гц

Колебания вектора напряженности E и вектора магнитной индукции B происходят во взаимно перпендикулярных плоскостях и перпендикулярно направлению распространения волны (вектору скорости) 



 #### Электромагнитное поле в средах описывается уравнениями Максвелла:

 #### Закон Гаусса в интегральной форме:
 $$ ∮D dS=∫ρ dV $$

 #### Закон Гаусса в дифференциальной форме:   
 $$ ∮D dS=∫ρ dV $$
`;

export interface IProps {
  mdxSource: any;
}

const Markdown: React.FC<IProps> = ({ mdxSource }) => {
  return (
    <div>
      <Head>
        <title>KaTeX test</title>
        <meta name="description" content="Generated by create next app" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.13.11/dist/katex.min.css"
          integrity="sha384-Um5gpz1odJg5Z4HAmzPtgZKdTBHZdw8S29IecapCSB31ligYPhHQZMIlWLYQGVoc"
          crossOrigin="anonymous"
        />
      </Head>

      <MainLayout>
        <div style={{ backgroundColor: "#f5f5f5" }}>
          <div className="markdown-body">
            {/* <span className="katex">
          <span className="katex-mathml">
            The KaTeX stylesheet is not loaded!
          </span>
          <span className="katex-version rule">KaTeX stylesheet version: </span>
        </span> */}

            <MDXRemote {...mdxSource} />
          </div>
        </div>
      </MainLayout >

    </div>

  );
}

export default Markdown;

export async function getStaticProps() {
  const mdxSource = await serialize(data, {
    mdxOptions: {
      remarkPlugins: [markdown, remarkMath],
      rehypePlugins: [rehypeKatex]
    }
  });

  return {
    props: {
      mdxSource
    }
  };
}