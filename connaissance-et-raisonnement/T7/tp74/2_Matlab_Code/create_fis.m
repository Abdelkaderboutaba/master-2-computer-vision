function fis = create_fis()

fis = mamfis('Name','VitesseSecurite');

fis = addInput(fis,[0 100],'Name','Distance');
fis = addMF(fis,'Distance','trapmf',[0 0 10 25],'Name','Proche');
fis = addMF(fis,'Distance','trimf',[15 40 65],'Name','Moyenne');
fis = addMF(fis,'Distance','trapmf',[50 70 100 100],'Name','Loin');

fis = addInput(fis,[0 100],'Name','Visibilite');
fis = addMF(fis,'Visibilite','trapmf',[0 0 20 40],'Name','Mauvaise');
fis = addMF(fis,'Visibilite','trimf',[30 55 75],'Name','Moyenne');
fis = addMF(fis,'Visibilite','trapmf',[60 80 100 100],'Name','Bonne');

fis = addOutput(fis,[0 120],'Name','Vitesse');
fis = addMF(fis,'Vitesse','trapmf',[0 0 20 40],'Name','FreinageUrgent');
fis = addMF(fis,'Vitesse','trimf',[30 50 70],'Name','Lent');
fis = addMF(fis,'Vitesse','trimf',[60 80 100],'Name','Normal');
fis = addMF(fis,'Vitesse','trapmf',[90 105 120 120],'Name','Rapide');

rules = [
1 1 1 1 1;
1 2 1 1 1;
1 3 2 1 1;
2 1 1 1 1;
2 2 2 1 1;
2 3 3 1 1;
3 1 2 1 1;
3 2 3 1 1;
3 3 4 1 1
];

fis = addRule(fis,rules);
end
