# Verse 1 Test Case

## Source USFM

```usfm
\v 1 \zaln-s |x-strong="G39720" x-lemma="Παῦλος" x-morph="Gr,N,,,,,NMS," x-occurrence="1" x-occurrences="1" x-content="Παῦλος"\*\w Paul|x-occurrence="1" x-occurrences="1"\w*\zaln-e\*,
\zaln-s |x-strong="G14010" x-lemma="δοῦλος" x-morph="Gr,N,,,,,NMS," x-occurrence="1" x-occurrences="1" x-content="δοῦλος"\*\w a|x-occurrence="1" x-occurrences="1"\w*
\w servant|x-occurrence="1" x-occurrences="1"\w*\zaln-e\*
```

## Desired HTML Output

```html
<usfm>
  <div class="preview" options="[object Object]" handlers="[object Object]">
    <section dir="" index="0">
      <div
        class="heading"
        dir=""
        style="white-space:nowrap;overflow:hidden;content-overflow:ellipsis"
        index="0"
        data-test-id="sectionHeading"
      ></div>
      <div class="sectionBody" dir="" index="0">
        <div class="contextMenuWrapper">
          <div
            class="block"
            style="width:100%;white-space:nowrap"
            index="0"
            contenteditable="false"
          >
            <header class="id">
              <marker class="id">\id </marker>TIT EN_ULT en_English_ltr Wed Aug 24 2022 09:32:57
              GMT-0400 (Eastern Daylight Time) tc
            </header>
            <header class="usfm"><marker class="usfm">\usfm </marker>3.0</header>
            <header class="id"><marker class="marker ide">\ide </marker>UTF-8</header>
            <header class="h"><marker class="marker h">\h </marker>Titus</header>
            <header class="toc1">
              <marker class="marker toc1">\toc1 </marker>The Letter of Paul to Titus
            </header>
            <header class="toc2"><marker class="marker toc2">\toc2 </marker>Titus</header>
            <header class="toc3"><marker class="marker toc3">\toc3 </marker>Tit</header>
            <header class="mt"><marker class="marker mt">\mt </marker>Titus</header>
            <header class="ts"><marker class="marker ts">\ts\*</marker></header>
          </div>
        </div>
      </div>
    </section>
    <section dir="" index="1">
      <div
        class="heading"
        dir=""
        style="white-space:nowrap;overflow:hidden;content-overflow:ellipsis"
        index="1"
        data-test-id="sectionHeading"
      ></div>
      <div class="sectionBody" dir="" index="1">
        <div class="contextMenuWrapper">
          <block style="width:100%;white-space:nowrap" index="0" contenteditable="false">
            <c> <marker>\c </marker><number>1</number> </c>
          </block>
        </div>
        <div class="contextMenuWrapper">
          <block style="width:100%;white-space:nowrap" index="1" contenteditable="false">
            <p><marker>\p</marker></p>
          </block>
        </div>
        <div class="contextMenuWrapper">
          <div
            class="block"
            style="width:100%;white-space:nowrap"
            index="2"
            contenteditable="false"
          >
            <v>
              <marker>\v </marker><number>1</number>
              <zaln>
                <marker class="zaln-s">\zaln-s </marker>
                <attributes
                  >|x-strong="G39720" x-lemma="Παῦλος" x-morph="Gr,N,,,,,NMS," x-occurrence="1"
                  x-occurrences="1" x-content="Παῦλος"
                </attributes>
                <marker class="*">\*</marker>
                <word>
                  <marker class="w">\w </marker>
                  <content>Paul</content>
                  <attributes>|x-occurrence="1" x-occurrences="1"</attributes>
                  <marker class="w*">\w*</marker>
                </word>
                <marker class="zaln-e">\zaln-e</marker>
                <marker class="*">\*</marker>,
              </zaln>
              <zaln>
                <marker class="zaln-s">\zaln-s </marker>
                <attributes
                  >|x-strong="G14010" x-lemma="δοῦλος" x-morph="Gr,N,,,,,NMS," x-occurrence="1"
                  x-occurrences="1" x-content="δοῦλος"
                </attributes>
                <marker class="*">\*</marker>
                <word>
                  <marker class="w">\w </marker>
                  <content>a</content>
                  <attributes>|x-occurrence="1" x-occurrences="1"</attributes>
                  <marker class="w*">\w*</marker>
                </word>
                <word>
                  <marker class="w">\w </marker>
                  <content>servant</content>
                  <attributes>|x-occurrence="1" x-occurrences="1"</attributes>
                  <marker class="w*">\w*</marker>
                </word>
                <marker class="zaln-e">\zaln-e</marker>
                <marker class="*">\*</marker>
              </zaln>
            </v>
          </div>
        </div>
      </div>
    </section>
  </div>
</usfm>
```
