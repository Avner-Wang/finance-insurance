数据导入mongodb步骤：
1、在命令窗口进入mongodb安装目录的/bin目录。
2、执行以下命令。

mongoimport --host 127.0.0.1 --db test --collection dirtywords --type csv --file D:\svn\PIMP\CODE\trunk\insurance\shrb-insurance-h5\models\dirtyword.csv --headerline --upsert