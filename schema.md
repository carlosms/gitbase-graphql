# Schema Types

<details>
  <summary><strong>Table of Contents</strong></summary>

  * [Query](#query)
  * [Objects](#objects)
    * [Blob](#blob)
    * [Commit](#commit)
    * [File](#file)
    * [Ref](#ref)
    * [Remote](#remote)
    * [Repository](#repository)
    * [TreeEntry](#treeentry)
    * [UASTNode](#uastnode)
    * [UASTPosition](#uastposition)
  * [Scalars](#scalars)
    * [Boolean](#boolean)
    * [Int](#int)
    * [JSON](#json)
    * [String](#string)

</details>

## Query 
<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>repository</strong></td>
<td valign="top"><a href="#repository">Repository</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">id</td>
<td valign="top"><a href="#string">String</a>!</td>
<td>

The path to the repository folder.
In case of [siva files](https://github.com/src-d/go-siva/), the id is the path + the siva file name.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>allRepositories</strong></td>
<td valign="top">[<a href="#repository">Repository</a>]</td>
<td></td>
</tr>
</tbody>
</table>

## Objects

### Blob

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>repository</strong></td>
<td valign="top"><a href="#repository">Repository</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>hash</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>size</strong></td>
<td valign="top"><a href="#int">Int</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>content</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>treeEntries</strong></td>
<td valign="top">[<a href="#treeentry">TreeEntry</a>]!</td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">name</td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">language</td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>file</strong></td>
<td valign="top"><a href="#file">File</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>uast</strong></td>
<td valign="top">[<a href="#uastnode">UASTNode</a>]!</td>
<td>

Babelfish UAST Node with fields that you can query.
Each children level has to be queried explicitly.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">language</td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">internal_type</td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">token</td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">filter_func</td>
<td valign="top"><a href="#string">String</a></td>
<td>

**EXPERIMENTAL**

A string with JS code. 'node' and 'result' are global variables.

e.g. "result = node.token.length > 15;"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">flat</td>
<td valign="top"><a href="#boolean">Boolean</a></td>
<td>

Flatten the tree allowing you filter nodes ignoring the tree level they are at.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>uastRaw</strong></td>
<td valign="top">[<a href="#json">JSON</a>]!</td>
<td>

Babelfish UAST Node, complete JSON

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">language</td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">xpath</td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
</tbody>
</table>

### Commit

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>repository</strong></td>
<td valign="top"><a href="#repository">Repository</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>hash</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>authorName</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>authorEmail</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>authorWhen</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>committerName</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>committerEmail</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>committerWhen</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>message</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>treeEntries</strong></td>
<td valign="top">[<a href="#treeentry">TreeEntry</a>]!</td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">name</td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">language</td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>blobs</strong></td>
<td valign="top">[<a href="#blob">Blob</a>]!</td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">hash</td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>files</strong></td>
<td valign="top">[<a href="#file">File</a>]!</td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">path</td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">language</td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
</tbody>
</table>

### File

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>repository</strong></td>
<td valign="top"><a href="#repository">Repository</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>path</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>blob</strong></td>
<td valign="top"><a href="#blob">Blob</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>rootTreeHash</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>mode</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>content</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>size</strong></td>
<td valign="top"><a href="#int">Int</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>language</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>uast</strong></td>
<td valign="top">[<a href="#uastnode">UASTNode</a>]!</td>
<td>

Babelfish UAST Node with fields that you can query.
Each children level has to be queried explicitly.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">language</td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">internal_type</td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">token</td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">filter_func</td>
<td valign="top"><a href="#string">String</a></td>
<td>

**EXPERIMENTAL**

A string with JS code. 'node' and 'result' are global variables.

e.g. "result = node.token.length > 15;"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">flat</td>
<td valign="top"><a href="#boolean">Boolean</a></td>
<td>

Flatten the tree allowing you filter nodes ignoring the tree level they are at.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>uastRaw</strong></td>
<td valign="top">[<a href="#json">JSON</a>]!</td>
<td>

Babelfish UAST Node, complete JSON

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">language</td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">xpath</td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
</tbody>
</table>

### Ref

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>repository</strong></td>
<td valign="top"><a href="#repository">Repository</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>name</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>commit</strong></td>
<td valign="top"><a href="#commit">Commit</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>commits</strong></td>
<td valign="top">[<a href="#commit">Commit</a>]!</td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">authorName</td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">authorEmail</td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>isRemote</strong></td>
<td valign="top"><a href="#boolean">Boolean</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>isTag</strong></td>
<td valign="top"><a href="#boolean">Boolean</a>!</td>
<td></td>
</tr>
</tbody>
</table>

### Remote

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>repository</strong></td>
<td valign="top"><a href="#repository">Repository</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>name</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>pushUrl</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>fetchUrl</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>pushRefspec</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>fetchRefspec</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
</tbody>
</table>

### Repository

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>id</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td>

The path to the repository folder.
In case of [siva files](https://github.com/src-d/go-siva/), the id is the path + the siva file name.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>refs</strong></td>
<td valign="top">[<a href="#ref">Ref</a>]!</td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">name</td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">isRemote</td>
<td valign="top"><a href="#boolean">Boolean</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">isTag</td>
<td valign="top"><a href="#boolean">Boolean</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>remotes</strong></td>
<td valign="top">[<a href="#remote">Remote</a>]!</td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">name</td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
</tbody>
</table>

### TreeEntry

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>repository</strong></td>
<td valign="top"><a href="#repository">Repository</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>hash</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>mode</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>name</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>language</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>blob</strong></td>
<td valign="top"><a href="#blob">Blob</a></td>
<td></td>
</tr>
</tbody>
</table>

### UASTNode

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>internal_type</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>children</strong></td>
<td valign="top">[<a href="#uastnode">UASTNode</a>]!</td>
<td>

Babelfish UAST Nodes with fields that you can query.
Each children level has to be queried explicitly.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">internal_type</td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">token</td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">filter_func</td>
<td valign="top"><a href="#string">String</a></td>
<td>

**EXPERIMENTAL**

A string with JS code. 'node' and 'result' are global variables.

e.g. "result = node.token.length > 15;"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">flat</td>
<td valign="top"><a href="#boolean">Boolean</a></td>
<td>

Flatten the tree allowing you filter nodes ignoring the tree level they are at.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>childrenRaw</strong></td>
<td valign="top">[<a href="#json">JSON</a>]!</td>
<td>

Babelfish UAST Nodes, complete JSON

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>token</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>start_position</strong></td>
<td valign="top"><a href="#uastposition">UASTPosition</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>end_position</strong></td>
<td valign="top"><a href="#uastposition">UASTPosition</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>roles</strong></td>
<td valign="top">[<a href="#int">Int</a>]</td>
<td>

TODO: can be transformed to string https://godoc.org/github.com/bblfsh/sdk/uast#Role

</td>
</tr>
</tbody>
</table>

### UASTPosition

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>offset</strong></td>
<td valign="top"><a href="#int">Int</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>line</strong></td>
<td valign="top"><a href="#int">Int</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>col</strong></td>
<td valign="top"><a href="#int">Int</a></td>
<td></td>
</tr>
</tbody>
</table>

## Scalars

### Boolean

The `Boolean` scalar type represents `true` or `false`.

### Int

The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1. 

### JSON

### String

The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.

