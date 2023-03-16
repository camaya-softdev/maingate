<?php

namespace App\Http\Controllers;

use App\Http\Requests\CustomChecklistRequest;
use App\Models\CustomChecklist;

class CustomChecklistController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return CustomChecklist::get();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Request\CustomChecklistRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CustomChecklistRequest $request)
    {
        return $request->all();

        return [
            'success' => (new CustomChecklist)->fill($request->validated())->save()
        ];
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Request\CustomChecklistRequest  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(CustomChecklistRequest $request, $id)
    {
        return [
            'success' => CustomChecklist::find($id)->update($request->validated())
        ];
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        return [
            'success' => CustomChecklist::find($id)->delete()
        ];
    }
}
